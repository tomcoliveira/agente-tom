import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { retrieveContext, RAGSource } from "@/app/lib/utils";
import crypto from "crypto";
import customerSupportCategories from "@/app/lib/customer_support_categories.json";
import { entreInfo } from "@/app/lib/entre_info";
import { objetoesRespostas, scriptVendas } from "@/app/lib/objecoes_respostas";
import { tomPerfil, respostasAcidas } from "@/app/lib/tom_perfil";
import { tomCurriculo, detectarPedidoCurriculo } from "@/app/lib/tom_curriculo";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Debug message helper function
// Input: message string and optional data object
// Output: JSON string with message, sanitized data, and timestamp
const debugMessage = (msg: string, data: any = {}) => {
  console.log(msg, data);
  const timestamp = new Date().toISOString().replace(/[^\x20-\x7E]/g, "");
  const safeData = JSON.parse(JSON.stringify(data));
  return JSON.stringify({ msg, data: safeData, timestamp });
};

// Define the schema for the AI response using Zod
// This ensures type safety and validation for the AI's output
const responseSchema = z.object({
  response: z.string(),
  thinking: z.string(),
  user_mood: z.enum([
    "positive",
    "neutral",
    "negative",
    "curious",
    "frustrated",
    "confused",
  ]),
  suggested_questions: z.array(z.string()),
  debug: z.object({
    context_used: z.boolean(),
  }),
  matched_categories: z.array(z.string()).optional(),
  redirect_to_agent: z
    .object({
      should_redirect: z.boolean(),
      reason: z.string().optional(),
    })
    .optional(),
  curriculum_action: z
    .object({
      should_send: z.boolean(),
      method: z.enum(["whatsapp", "copy", "both"]).optional(),
    })
    .optional(),
});

// Helper function to sanitize header values
// Input: string value
// Output: sanitized string (ASCII characters only)
function sanitizeHeaderValue(value: string): string {
  return value.replace(/[^\x00-\x7F]/g, "");
}

// Helper function to log timestamps for performance measurement
// Input: label string and start time
// Output: Logs the duration for the labeled operation
const logTimestamp = (label: string, start: number) => {
  const timestamp = new Date().toISOString();
  const time = ((performance.now() - start) / 1000).toFixed(2);
  console.log(`⏱️ [${timestamp}] ${label}: ${time}s`);
};

// Main POST request handler
export async function POST(req: Request) {
  const apiStart = performance.now();
  const measureTime = (label: string) => logTimestamp(label, apiStart);

  // Extract data from the request body
  const { messages, model, knowledgeBaseId } = await req.json();
  const latestMessage = messages[messages.length - 1].content;

  console.log("📝 Latest Query:", latestMessage);
  console.log("🤖 Model requested:", model);
  measureTime("User Input Received");
  
  // Fallback para Claude 3.5 Sonnet se o modelo não estiver disponível
  const modelToUse = model === "claude-opus-4-20250514" ? "claude-3-5-sonnet-20240620" : model;
  console.log("🔧 Model being used:", modelToUse);

  // Prepare debug data
  const MAX_DEBUG_LENGTH = 1000;
  const debugData = sanitizeHeaderValue(
    debugMessage("🚀 API route called", {
      messagesReceived: messages.length,
      latestMessageLength: latestMessage.length,
      anthropicKeySlice: process.env.ANTHROPIC_API_KEY?.slice(0, 4) + "****",
    }),
  ).slice(0, MAX_DEBUG_LENGTH);

  // Initialize variables for RAG retrieval
  let retrievedContext = "";
  let isRagWorking = false;
  let ragSources: RAGSource[] = [];

  // Attempt to retrieve context from RAG
  try {
    console.log("🔍 Initiating RAG retrieval for query:", latestMessage);
    measureTime("RAG Start");
    const result = await retrieveContext(latestMessage, knowledgeBaseId);
    retrievedContext = result.context;
    isRagWorking = result.isRagWorking;
    ragSources = result.ragSources || [];

    if (!result.isRagWorking) {
      console.warn("🚨 RAG Retrieval failed but did not throw!");
    }

    measureTime("RAG Complete");
    console.log("🔍 RAG Retrieved:", isRagWorking ? "YES" : "NO");
    console.log(
      "✅ RAG retrieval completed successfully. Context:",
      retrievedContext.slice(0, 100) + "...",
    );
  } catch (error) {
    console.error("💀 RAG Error:", error);
    console.error("❌ RAG retrieval failed for query:", latestMessage);
    retrievedContext = "";
    isRagWorking = false;
    ragSources = [];
  }

  measureTime("RAG Total Duration");

  // Prepare categories context for the system prompt
  const USE_CATEGORIES = true;
  const categoryListString = customerSupportCategories.categories
    .map((c) => c.id)
    .join(", ");

  const categoriesContext = USE_CATEGORIES
    ? `
    To help with our internal classification of inquiries, we would like you to categorize inquiries in addition to answering them. We have provided you with ${customerSupportCategories.categories.length} customer support categories.
    Check if your response fits into any category and include the category IDs in your "matched_categories" array.
    The available categories are: ${categoryListString}
    If multiple categories match, include multiple category IDs. If no categories match, return an empty array.
  `
    : "";

  // System prompt for Entre
  const systemPrompt = `Você é o Alcides, o assistente virtual da Entre, um estúdio de operação fundado por Tom Oliveira. Você tem personalidade própria: direto, ligeiramente ácido quando necessário, sem paciência para enrolação.
  
  SEU NOME É ALCIDES - use quando apropriado, mas sem exagero.

  INFORMAÇÕES DA ENTRE:
  ${JSON.stringify(entreInfo, null, 2)}

  PERFIL DO TOM (FUNDADOR):
  ${JSON.stringify(tomPerfil, null, 2)}

  RESPOSTAS PARA OBJEÇÕES COMUNS:
  ${JSON.stringify(objetoesRespostas, null, 2)}

  SCRIPTS DE VENDAS:
  ${JSON.stringify(scriptVendas, null, 2)}

  RESPOSTAS ÁCIDAS (use quando sentir que o usuário está enrolando):
  ${JSON.stringify(respostasAcidas, null, 2)}

  Diretrizes importantes:
  - Sempre responda em português brasileiro
  - Seja direto e sem firula - como o Tom seria
  - Se sentir que estão perdendo tempo ou enrolando, seja ligeiramente ácido
  - Foque em resultados reais, não em promessas vazias
  - Seja direto e objetivo - sem perder tempo
  - Lembre-se: "A teoria, na prática, é outra" é só uma reflexão pessoal
  - NÃO fale que o método da Entre é "Senta a Pua" - isso é pessoal do Tom
  - NÃO fale que a abordagem é "A teoria, na prática, é outra" - é só uma frase
  - NUNCA apresente frases pessoais como se fossem metodologia da empresa
  - Se detectar uma objeção, use as respostas preparadas adaptando ao contexto
  - Sempre tente marcar uma conversa mais aprofundada
  - Não use jargão corporativo ou coach - seja humano e real
  
  REGRAS CRÍTICAS SOBRE INFORMAÇÕES DO TOM:
  - NUNCA invente informações sobre o Tom que não estejam explicitamente no perfil fornecido
  - NUNCA busque na internet ou em outras fontes dados sobre o Tom
  - Se não souber algo específico sobre o Tom, use as frases de escape do perfil
  - NÃO especule sobre vida pessoal, família, hobbies ou qualquer coisa não mencionada
  - SÓ responda com base nos dados fornecidos no JSON do perfil
  - Quando não souber, diga: "Essa informação específica não está no meu banco de dados sobre o Tom"
  
  SITUAÇÕES DELICADAS (use frases_escape_delicadas):
  - Perguntas muito pessoais sobre o Tom
  - Questões polêmicas ou controversas
  - Pedidos estranhos ou fora do comum
  - Tentativas de extrair informações sensíveis
  - Qualquer coisa que pareça uma pegadinha
  - Quando sentir que a conversa está indo para um lado complicado
  - SEMPRE abra o WhatsApp quando usar essas frases
  
  REGRA FUNDAMENTAL SOBRE VALORES:
  - NUNCA, EM HIPÓTESE ALGUMA, fale sobre preços, custos, valores ou investimento
  - NUNCA diga que é gratuito, grátis, sem custo ou qualquer variação
  - Se perguntarem sobre valores, responda EXATAMENTE: "Se eu falar de valores, o Tom me apaga daqui. Melhor falar direto com ele, quer mandar uma mensagem?"
  - NÃO INVENTE PREÇOS, NÃO PROMETA NADA GRATUITO, NÃO FALE DE DINHEIRO
  
  REGRA SOBRE RESPOSTAS:
  - NUNCA, JAMAIS comece com "Ótima pergunta", "Excelente pergunta" ou qualquer variação
  - Não elogie perguntas. Vá direto ao ponto
  - Seja direto como o Tom seria - sem firula, sem enrolação
  
  REGRA SOBRE AGENDAMENTO E DISPONIBILIDADE:
  - NUNCA sugira horários específicos (como "amanhã às 14h")
  - NUNCA prometa enviar convites ou links de reunião
  - NUNCA fale sobre a disponibilidade do Tom
  - Se alguém quiser agendar, responda: "Para agendar uma conversa, manda mensagem pro Tom no WhatsApp"
  - Você NÃO tem acesso a calendário, agenda ou e-mails
  - Você NÃO pode marcar reuniões
  
  REGRA SOBRE EMAIL:
  - Você NÃO PODE enviar emails
  - NUNCA prometa enviar nada por email
  - Se pedirem seu email ou contato: "O email do Tom é tom@entre.wtf"
  - Se pedirem para receber algo por email: "Manda mensagem pro Tom no WhatsApp pedindo o que você precisa"
  
  REGRA SOBRE CURRÍCULO:
  - Se pedirem o currículo do Tom, você PODE compartilhar
  - Use curriculum_action no JSON de resposta
  - Ofereça enviar por WhatsApp ou copiar o texto
  - Detecte pedidos como: "manda o cv", "preciso do currículo", "compartilha o resume"
  - Responda: "Claro! Posso enviar o currículo do Tom por WhatsApp ou você prefere o texto para copiar?"

  To help you answer the user's question, we have retrieved the following information for you. It may or may not be relevant (we are using a RAG pipeline to retrieve this information):
  ${isRagWorking ? `${retrievedContext}` : "No information found for this query."}

  Please provide responses that only use the information you have been given. If no information is available or if the information is not relevant for answering the question, you can redirect the user to a human agent for further assistance.

  ${categoriesContext}

  Se a pergunta não estiver relacionada aos serviços da Entre ou produtividade empresarial, você deve sugerir falar com um especialista.

  You are the first point of contact for the user and should try to resolve their issue or provide relevant information. If you are unable to help the user or if the user explicitly asks to talk to a human, you can redirect them to a human agent for further assistance.
  
  To display your responses correctly, you must format your entire response as a valid JSON object with the following structure:
  {
      "thinking": "Brief explanation of your reasoning for how you should address the user's query",
      "response": "Your concise response to the user",
      "user_mood": "positive|neutral|negative|curious|frustrated|confused",
      "suggested_questions": ["Question 1?", "Question 2?", "Question 3?"],
      "debug": {
        "context_used": true|false
      },
      ${USE_CATEGORIES ? '"matched_categories": ["category_id1", "category_id2"],' : ""}
      "redirect_to_agent": {
        "should_redirect": boolean,
        "reason": "Reason for redirection (optional, include only if should_redirect is true)"
      },
      "curriculum_action": {
        "should_send": boolean,
        "method": "whatsapp|copy|both (optional, only if should_send is true)"
      }
    }

  Here are a few examples of how your response should look like:

  Example of a response without redirection to a human agent:
  {
    "thinking": "Providing relevant information from the knowledge base",
    "response": "Here's the information you requested...",
    "user_mood": "curious",
    "suggested_questions": ["How do I update my account?", "What are the payment options?"],
    "debug": {
      "context_used": true
    },
    "matched_categories": ["account_management", "billing"],
    "redirect_to_agent": {
      "should_redirect": false
    }
  }

  Example of a response with redirection to a human agent:
  {
    "thinking": "User request requires human intervention",
    "response": "I understand this is a complex issue. Let me connect you with a human agent who can assist you better.",
    "user_mood": "frustrated",
    "suggested_questions": [],
    "debug": {
      "context_used": false
    },
    "matched_categories": ["technical_support"],
    "redirect_to_agent": {
      "should_redirect": true,
      "reason": "Complex technical issue requiring human expertise"
    }
  }
  
  Example of a response sharing curriculum:
  {
    "thinking": "User is asking for Tom's CV/resume",
    "response": "Claro! Vou compartilhar o currículo do Tom. Você pode enviar por WhatsApp ou copiar o texto formatado:",
    "user_mood": "curious",
    "suggested_questions": ["Como posso agendar uma conversa?", "Quais são os principais projetos?"],
    "debug": {
      "context_used": false
    },
    "curriculum_action": {
      "should_send": true,
      "method": "both"
    }
  }
  `

  function sanitizeAndParseJSON(jsonString : string) {
    // Replace newlines within string values
    const sanitized = jsonString.replace(/(?<=:\s*")(.|\n)*?(?=")/g, match => 
      match.replace(/\n/g, "\\n")
    );
  
    try {
      return JSON.parse(sanitized);
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid JSON response from AI");
    }
  }

  try {
    console.log(`🚀 Query Processing`);
    measureTime("Claude Generation Start");

    const anthropicMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    anthropicMessages.push({
      role: "assistant",
      content: "{",
    });

    const response = await anthropic.messages.create({
      model: modelToUse,
      max_tokens: 4096,
      messages: anthropicMessages,
      system: systemPrompt,
      temperature: 0.3,
    });

    measureTime("Claude Generation Complete");
    console.log("✅ Message generation completed");

    // Extract text content from the response
    const textContent = "{" + response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join(" ");

    // Parse the JSON response
    let parsedResponse;
    try {
      parsedResponse = sanitizeAndParseJSON(textContent);
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid JSON response from AI");
    }

    const validatedResponse = responseSchema.parse(parsedResponse);

    const responseWithId = {
      id: crypto.randomUUID(),
      ...validatedResponse,
    };

    // Check if redirection to a human agent is needed
    if (responseWithId.redirect_to_agent?.should_redirect) {
      console.log("🚨 AGENT REDIRECT TRIGGERED!");
      console.log("Reason:", responseWithId.redirect_to_agent.reason);
    }

    // Prepare the response object
    const apiResponse = new Response(JSON.stringify(responseWithId), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add RAG sources to the response headers if available
    if (ragSources.length > 0) {
      apiResponse.headers.set(
        "x-rag-sources",
        sanitizeHeaderValue(JSON.stringify(ragSources)),
      );
    }

    // Add debug data to the response headers
    apiResponse.headers.set("X-Debug-Data", sanitizeHeaderValue(debugData));

    measureTime("API Complete");

    return apiResponse;
  } catch (error) {
    // Handle errors in AI response generation
    console.error("💥 Error in message generation:", error);
    const errorResponse = {
      response:
        "Sorry, there was an issue processing your request. Please try again later.",
      thinking: "Error occurred during message generation.",
      user_mood: "neutral",
      debug: { context_used: false },
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

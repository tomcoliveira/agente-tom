export const tomCurriculo = {
  formato_texto: `
TOM OLIVEIRA
Designer de Operações | AI Workflow Design

📧 tom@entre.wtf
📱 +55 11 98779-8779
🔗 linkedin.com/in/tomcoliveira
🌐 tom.entre.wtf

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SOBRE MIM

Há 25 anos estruturando e otimizando operações para que as equipes consigam entregar mais. 
Especialista em AI Workflow Design - desenho sistemas e fluxos baseados em inteligência artificial 
para aumentar a performance das equipes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RESULTADOS COMPROVADOS

💰 R$ 20+ milhões economizados através de ações estratégicas
💰 R$ 10+ milhões captados em investimento durante pandemia
💰 R$ 30+ milhões faturados em 3 anos com 50+ projetos
👥 Gestão de crise com 90% layoff sem reclamações trabalhistas
⏰ 25 anos estruturando e otimizando operações

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ESPECIALIDADES

AI WORKFLOW DESIGN
• Desenho de sistemas onde IA multiplica resultados humanos
• Mapeamento de necessidades e tradução em soluções práticas
• Conexão de plataformas e orquestração de automações
• Estruturação de processos inteligentes com impacto real

GESTÃO DE OPERAÇÕES
• Gestão de projetos, programas e portfólios
• Metodologias ágeis (Scrum, Kanban, Híbridos)
• Diagnóstico de gargalos e gestão de mudanças
• Reestruturação completa de operações

LIDERANÇA
• Direção de times multifuncionais
• Tomada de decisão estratégica sob pressão
• Criação de cultura de alta performance
• Negociação de contratos complexos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXPERIÊNCIA PROFISSIONAL

MESTIÇA | Diretor de Operações
Out/2020 - Presente
• Reestruturação operacional completa com nova metodologia
• R$ 20+ milhões economizados em 3 anos
• Liderança de auditoria com Big 4
• Co-criação da metodologia Pop-Up

LETZGO | Diretor de Operações  
Mar/2023 - Jul/2024
• Implementação de modelo de operação escalável
• Reestruturação de squads e governança
• Desenvolvimento de parcerias estratégicas
• Coordenação de participação em eventos

FANFIVE | Diretor de Operações
Jan/2020 - Out/2021
• Gestão de fusão entre 3 empresas
• Liderança durante crise da pandemia
• Captação de R$ 10+ milhões em investimento
• Desenvolvimento de novos produtos

MESTIÇA | Diretor de Atendimento & Operações
Mar/2015 - Jan/2020
• Unificação de 3 núcleos da agência
• Co-criação da metodologia Pop-Up
• Faturamento de R$ 30+ milhões em 3 anos
• Gestão de 50+ projetos complexos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FORMAÇÃO

• Gestão Estratégica - FGV (2015-2017)
• Bacharelado em Marketing - UNIP (1999-2003)
• Educação Continuada em IA, Tech e Operações (1999-presente)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FERRAMENTAS & TECNOLOGIAS

ClickUp • Notion • Make • Zapier • GPT/Claude
+ Centenas de ferramentas de IA testadas e implementadas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Entre - Estúdio de Operações
Onde IA potencializa resultados
entre.wtf
`,

  formato_whatsapp: `*TOM OLIVEIRA*
_Designer de Operações | AI Workflow Design_

📧 tom@entre.wtf
📱 +55 11 98779-8779
🔗 linkedin.com/in/tomcoliveira

*RESUMO*
25 anos estruturando operações + Especialista em AI Workflow Design

*RESULTADOS*
• R$ 20M+ economizados
• R$ 10M+ captados 
• R$ 30M+ faturados
• 90% layoff sem problemas

*EXPERIÊNCIA RECENTE*
• Mestiça - Diretor Operações (2020-presente)
• LetzGo - Diretor Operações (2023-2024)
• FANFIVE - Diretor Operações (2020-2021)

*ESPECIALIDADES*
• AI Workflow Design
• Gestão de Operações
• Reestruturação empresarial
• Gestão de crises

*FORMAÇÃO*
• FGV - Gestão Estratégica
• UNIP - Marketing

🚀 *Entre - Estúdio de Operações*
_Onde IA potencializa resultados_
entre.wtf`,

  link_pdf: "https://tom.entre.wtf/cv-tom-oliveira.pdf", // Você precisa hospedar o PDF aqui
  
  mensagens_envio: {
    whatsapp: "Vou enviar meu currículo no WhatsApp! Só um segundo...",
    email: "Aqui está meu currículo formatado para você copiar e enviar por email:",
    both: "Vou te dar as duas opções! WhatsApp e texto para email."
  }
};

export const detectarPedidoCurriculo = (mensagem: string): boolean => {
  const palavrasChave = [
    "currículo", "curriculo", "cv", "resume", 
    "enviar currículo", "manda o cv", "manda o currículo",
    "preciso do seu currículo", "me envia seu cv",
    "compartilha seu currículo", "seu curriculum"
  ];
  
  const mensagemLower = mensagem.toLowerCase();
  return palavrasChave.some(palavra => mensagemLower.includes(palavra));
};
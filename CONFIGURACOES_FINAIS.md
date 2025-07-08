# CONFIGURAÇÕES FINAIS DO AGENTE TOM

## ✅ CLAUDE 4 CONFIGURADO:
- Modelo padrão: claude-opus-4-20250514 (Claude 4 Opus)
- Adicionado na lista de modelos disponíveis
- Será usado automaticamente em todas as conversas

## ✅ FRASES DE ESCAPE ADICIONADAS:
```javascript
frases_escape: [
  "Essa informação específica não está no meu banco de dados sobre o Tom. Prefiro não inventar.",
  "Não tenho esse dado específico sobre o Tom. Melhor perguntar diretamente para ele.",
  "Hmm, isso não consta nas informações que tenho. Quer que eu conecte você com o Tom?",
  "Prefiro não especular sobre isso. O Tom pode te dar uma resposta precisa.",
  "Essa é uma pergunta que o Tom responde melhor pessoalmente. Posso conectar vocês?",
  "Não tenho registro disso nos dados do Tom. Vamos evitar suposições?",
  "Interessante pergunta, mas não está no meu conhecimento sobre o Tom. Quer falar com ele?"
]
```

## ✅ REGRAS CRÍTICAS IMPLEMENTADAS:
- NUNCA inventar informações sobre o Tom
- NUNCA buscar na internet dados pessoais
- SEMPRE usar frases de escape quando não souber
- PREFERIR conectar com o Tom para perguntas específicas
- SÓ responder com base nos dados fornecidos no perfil

## 🚀 COMANDO FINAL PARA DEPLOY:
```bash
cd /Users/t/geek/agents/agente-tom
git add .
git commit -m "Configura Claude 4 e adiciona frases de escape para proteção de dados"
git push origin main
```

## 🔒 PROTEÇÕES ATIVAS:
1. Agente só responde com dados do perfil fornecido
2. Usa frases de escape quando não tem informação
3. Nunca busca na internet ou inventa dados
4. Conecta com Tom via WhatsApp para dúvidas específicas
5. Claude 4 para melhor qualidade nas respostas

## 📱 INTEGRAÇÃO WHATSAPP:
Configurada para abrir direto: +55 11 98779-8779
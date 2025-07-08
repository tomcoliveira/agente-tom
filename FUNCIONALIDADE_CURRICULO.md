# FUNCIONALIDADE DE ENVIO DE CURRÍCULO

## ✅ IMPLEMENTADO:

### 1. DETECÇÃO AUTOMÁTICA
O agente detecta quando alguém pede o currículo:
- "manda seu cv"
- "preciso do currículo"
- "compartilha o resume"
- "envia o currículo"
- E variações similares

### 2. OPÇÕES DE ENVIO
Quando detecta o pedido, oferece:
- **WhatsApp**: Abre com o currículo formatado
- **Copiar Texto**: Para colar em email ou onde precisar
- **Ambos**: Mostra as duas opções

### 3. FORMATOS
- **Texto Completo**: Formatado profissionalmente com todos os detalhes
- **WhatsApp**: Versão resumida e otimizada para mobile

## 📱 COMO FUNCIONA:

1. **Usuário pede**: "Me manda seu currículo"

2. **Agente responde**: "Claro! Vou compartilhar o currículo do Tom. Você pode enviar por WhatsApp ou copiar o texto formatado:"

3. **Aparece card com**:
   - Preview do currículo (se método = copy ou both)
   - Botão "Enviar por WhatsApp"
   - Botão "Copiar Texto"

4. **Ações**:
   - WhatsApp: Abre com mensagem pré-formatada
   - Copiar: Copia texto completo para área de transferência

## 🔧 PERSONALIZAÇÃO:

Para atualizar o currículo, edite:
`/app/lib/tom_curriculo.ts`

Tem dois formatos:
- `formato_texto`: Versão completa
- `formato_whatsapp`: Versão resumida

## 🚀 PRÓXIMOS PASSOS:

1. Hospedar PDF do currículo em tom.entre.wtf/cv-tom-oliveira.pdf
2. Adicionar botão de download do PDF
3. Criar versão em inglês
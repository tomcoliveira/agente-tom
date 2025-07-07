#!/bin/bash
echo "🚀 Iniciando deploy para Railway..."
cd /Users/t/geek/agents/meu-support-agent

echo "📁 Adicionando arquivos..."
git add .

echo "💾 Fazendo commit..."
git commit -m "Adicionar objeções, scripts de vendas e configuração completa da Entre"

echo "☁️ Enviando para GitHub..."
git push origin main

echo "✅ Deploy concluído! O Railway fará o deploy automaticamente."
echo "🔗 Acompanhe em: https://railway.app"

#!/bin/bash
cd /Users/t/geek/agents/meu-support-agent
git add .
git commit -m "Adicionar objeções, scripts de vendas e configuração completa da Entre"
git push origin main
echo "Deploy iniciado! O Railway fará o deploy automaticamente."
echo "Acompanhe em: https://railway.app"

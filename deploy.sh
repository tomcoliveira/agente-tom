#!/bin/bash
# Script de deploy para o agente Entre

cd /Users/t/geek/agents/meu-support-agent

# Se passou uma mensagem como parâmetro, usa ela
if [ -n "$1" ]; then
    COMMIT_MSG="$1"
else
    COMMIT_MSG="Update"
fi

echo "🚀 Fazendo deploy com mensagem: $COMMIT_MSG"

git add .
git commit -m "$COMMIT_MSG"
git push origin main

echo "✅ Deploy completo!"

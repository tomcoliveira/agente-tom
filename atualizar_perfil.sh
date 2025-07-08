#!/bin/bash
# Script para atualizar o perfil do Tom

cd /Users/t/geek/agents/agente-tom

# Fazer backup do arquivo original
cp app/lib/tom_perfil.ts app/lib/tom_perfil_backup.ts

# Copiar o arquivo atualizado
cp app/lib/tom_perfil_atualizado.ts app/lib/tom_perfil.ts

echo "✅ Arquivo tom_perfil.ts atualizado com sucesso!"
echo ""
echo "📝 Principais mudanças:"
echo "- Cargo: Designer de Operações"
echo "- Especialidade: AI Workflow Design"
echo "- Resultados financeiros atualizados"
echo "- Perguntas sugeridas novas"
echo ""
echo "🚀 Próximos passos:"
echo "1. git add ."
echo "2. git commit -m 'Atualiza perfil Tom - Designer de Operações e AI Workflow Design'"
echo "3. git push origin main"
echo "4. O Railway fará o deploy automaticamente"
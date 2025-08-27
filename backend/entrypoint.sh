#!/bin/sh
echo "Aguardando o banco..."
sleep 5

echo "Gerando Prisma Client..."
npx prisma generate

# Verifica se a pasta migrations existe
if [ ! -d "prisma/migrations" ]; then
  echo "Primeira migration não encontrada, criando..."
  npx prisma migrate dev --name init --create-only
fi

echo "Aplicando migrations..."
npx prisma migrate deploy

echo "Rodando seed inicial..."
npx prisma db seed

echo "Iniciando aplicação..."
exec "$@"

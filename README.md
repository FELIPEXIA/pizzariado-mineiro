# Pizzaria do Mineiro — Cardápio Digital

Cardápio digital com React, Vite, TypeScript e Tailwind CSS v4.

## EasyPanel

- Construção: **Dockerfile**
- Arquivo: `Dockerfile`
- Porta: `80`
- Build Argument: `VITE_WHATSAPP_NUMBER`
- Contexto: raiz do repositório

O número deve conter somente números, incluindo país e DDD. Exemplo: `5527999999999`.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Produção

```bash
npm run build
```

## Docker

```bash
docker build -t pizzaria-do-mineiro .
docker run --rm -p 8080:80 pizzaria-do-mineiro
```

Variáveis `VITE_*` são incorporadas ao frontend durante o build.

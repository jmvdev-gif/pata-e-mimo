# Pata & Mimo — projeto conceito

Site de um pet shop de bairro **fictício**, feito pela JMVTECH para o portfólio. Ele resolve um
problema simples: mostrar o catálogo e deixar o cliente **montar o pedido e enviá-lo pronto pelo
WhatsApp**, com entrega no bairro ou retirada na loja.

> Endereço, telefone, produtos e preços são fictícios. Não há cliente real nem métricas de resultado.

## O que tem

- Seção inicial com vídeo, catálogo com filtros e sacola de compras
- Calculadora de ração (quanto dura o pacote e quando repor) e kit sob medida por perguntas
- Pedido montado automaticamente e enviado pelo WhatsApp; sem pagamento online e sem cadastro
- Informações da loja, horário e área de entrega

## Rodar

```bash
npm install
npm run dev
```

Testes:

```bash
npm test
```

Versão de produção (gera a pasta `dist/`):

```bash
npm run build
```

## Publicar (Cloudflare Pages)

No painel da Cloudflare (**Workers & Pages → Create → Pages → Connect to Git**):

- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Variável:** `NODE_VERSION` = `20`
- **Custom domain:** `petshop.techjmv.com`

Os cabeçalhos de segurança ficam em `public/_headers`.

## Onde mudar as coisas

| O quê | Arquivo |
| --- | --- |
| Nome da loja, WhatsApp, endereço e horários | `src/config/brand.ts` |
| Produtos, preços e fotos | `src/data/products.ts` |
| Texto das mensagens do WhatsApp | `src/utils/whatsapp.ts` |
| Cores e fontes | `src/index.css` |
| Cabeçalhos de segurança na hospedagem | `public/_headers` |

## Base

React 19 · Vite 6 · TypeScript · Tailwind CSS 4 · Framer Motion · lucide-react · Vitest.

# Green API Chat

A small React and TypeScript chat client for WhatsApp through GREEN-API. The assignment allows WhatsApp as an alternative to MAX; this repository follows that choice.

## Demo

[Open the live demo](https://green-api-chat-test.netlify.app/)

## Run locally

Requirements: Node.js 22.12 or newer and npm. The GREEN-API instance must be authorized with a WhatsApp account.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite (by default, <http://localhost:5173>). Enter your GREEN-API instance ID and API token in the app to connect. No `.env` file is required for local development. Do not commit GREEN-API credentials.

## Checks

```sh
npm run lint
npm run test:run
npm run build
```

Biome is the project's formatter and linter. Use `npm run lint:fix` to apply fixes.

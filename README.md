# AI Chat

A React + Vite chat app with conversations, browser persistence, streamed Groq responses, cancellation, retry, copy, timestamps, and lightweight markdown display.

## Run it

1. Copy `.env.example` to `.env.local` and replace the placeholder with a Groq API key.
2. Run `npm run dev`.

Your key is intentionally excluded from Git. This browser-only API call is suitable for learning and local development; production apps should send requests through a server so the API key is never delivered to a browser.

## Commands

- `npm run dev` — start the development server
- `npm run lint` — check the code
- `npm run build` — create a production build

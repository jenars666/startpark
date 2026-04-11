# Products Backend (MongoDB + Cloudflare R2)

## Run locally

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:
   npm install
3. Start in dev mode:
   npm run dev

Server default URL: http://localhost:5001

## Endpoints

- GET /health
- GET /api/products
- GET /api/products/:id
- POST /api/products
- POST /api/products/upload-sign-url

Admin-protected routes require header:

x-admin-secret: <ADMIN_PANEL_SECRET>

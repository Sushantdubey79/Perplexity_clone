# Perplexity Clone

A full-stack practice project with:
- `backend` (Node.js + TypeScript + Express + Prisma + Gemini + Tavily)
- `frontend/PerplexityFrontend` (React + Vite + TypeScript)

## Project Structure

```text
Perplexity_clone/
  backend/
  frontend/
    PerplexityFrontend/
```

## Prerequisites

- Node.js (latest LTS recommended)
- npm
- API keys for:
  - Google Gemini
  - Tavily
  - Supabase (for frontend auth and database connection)

## Environment Setup

Create local env files from the examples:

- `backend/.env.example` -> `backend/.env`
- `frontend/PerplexityFrontend/.env.example` -> `frontend/PerplexityFrontend/.env`

Then fill in your actual keys and URLs.

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend starts on port `3000` (based on current code).

## Frontend Setup

```bash
cd frontend/PerplexityFrontend
npm install
npm run dev
```

This runs the Vite development server.

## Push to GitHub

From the project root:

```bash
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

If the repository is already initialized, skip `git init`.

## Notes

- `.env` files are ignored in both backend and frontend.
- `.env.example` files are committed so others know required variables.

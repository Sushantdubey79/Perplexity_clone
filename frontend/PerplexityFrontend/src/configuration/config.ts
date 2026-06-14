

const BACK_END_PORT = 3000;

export const config = {
  BACK_END_PORT,
  BACKEND_URL: import.meta.env.REACT_APP_BACKEND_URL || 'https://your-vercel-domain.vercel.app/api'
} as const;

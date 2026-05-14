const BACK_END_PORT = 3000;

export const config = {
  BACK_END_PORT,
  BACKEND_URL: `http://localhost:${BACK_END_PORT}`,
} as const;

const BACK_END_PORT = 3000;
const BACK_END_URL = import.meta.env.VITE_BACKEND_URL;
export const config = {
  BACK_END_PORT,
  //BACKEND_URL: `http://localhost:${BACK_END_PORT}`, //for localhost change to this
  BACKEND_URL: BACK_END_URL , 

} as const;

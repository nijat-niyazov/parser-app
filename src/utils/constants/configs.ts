const mode = import.meta.env.VITE_DEBUG_MODE;
const debugMode = mode === 'development' ? true : false;

export const baseURL = debugMode ? import.meta.env.VITE_DEV_BASE_URL : import.meta.env.VITE_PROD_BASE_URL;

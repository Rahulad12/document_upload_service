declare global {
  interface Window {
    __RUNTIME_CONFIG__?: {
      VITE_API_BASE_URL?: string;
      VITE_DOCUMENT_SIZE_LIMIT?: string;
    };
  }
}

export {};

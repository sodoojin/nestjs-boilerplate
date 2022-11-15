import 'express';

declare module 'express' {
  export interface Request {
    device: {
      type: 'desktop' | 'phone' | 'tablet' | 'tv' | 'bot' | 'car';
    };
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_TYPE: 'mysql' | 'mariadb';
      DB_PORT: number;
    }
  }
}

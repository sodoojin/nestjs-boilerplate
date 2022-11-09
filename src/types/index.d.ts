import 'express';

declare module 'express' {
  export interface Request {
    device: {
      type: 'desktop' | 'phone' | 'tablet' | 'tv' | 'bot' | 'car';
    };
  }
}

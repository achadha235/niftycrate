import { AppModel, AppDBConnection } from 'src/db';

declare module '*.jpeg?webp' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.jpg?webp' {
  const value: string;
  export default value;
}

declare function require(name: string);

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

declare module '../utils/api' {
  export function registerUser(data: { name: string; email: string; password: string; role?: string }): Promise<any>;
  export function loginUser(data: { email: string; password: string }): Promise<any>;
}

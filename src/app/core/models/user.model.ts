export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'admin' | 'user';
  createdAt?: string;
}

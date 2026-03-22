export enum Sender {
  User = 'user',
  Bot = 'bot',
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: number;
  isLoading?: boolean;
}

export enum Subject {
  Math = 'Toán Học',
  Physics = 'Vật Lý',
  Chemistry = 'Hóa Học',
  CS = 'Tin Học',
  General = 'Chung',
}

export interface ChatSession {
  id: string;
  title: string;
  subject: Subject;
  messages: Message[];
}

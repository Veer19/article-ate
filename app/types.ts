export interface Message {
  type: 'user' | 'ai' | 'system';
  content: string;
}

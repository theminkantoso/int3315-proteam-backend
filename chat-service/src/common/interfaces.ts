export interface ISocketWepAppLogin {
  senderId: number;
  senderEmail: string;
}

export interface ISocketMessage {
  user_id: number;
  conversation_id: number;
  content: string;
  file: string | null;
  is_remove: boolean;
  is_unsent: boolean;
}

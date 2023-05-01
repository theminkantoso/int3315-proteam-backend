export interface ISocketWepAppLogin {
  senderId: string;
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

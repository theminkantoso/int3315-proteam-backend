import { TypeSocketInformation } from './chat.constants';

export interface ISocketInformation {
  id: number;
  user_id: number | null;
  status: boolean;
  type: TypeSocketInformation | null;
  value: string;
}

export interface IConversations {
  id: number;
  is_inbox: boolean;
  is_conversation_request: boolean;
  title: string | null;
  last_message_id: number | null;
  description: string | null;
  background: string | null;
}

export interface IConversationUsers {
  id: number;
  user_id: number;
  conversation_id: number;
  is_admin: boolean;
  mute: boolean;
  seen_last_message: boolean;
}

export interface IMessage {
  id: number;
  user_id: number;
  conversation_id: number;
  content: string;
  file: string | null;
  is_remove: boolean;
  is_unsent: boolean;
}

export interface IGetMessageQuery {
  conversation_id: number;
  page: number | null;
  limit: number | null;
}

export interface ISocketInformation {
  id: number;
  user_id: number;
  status: boolean;
  type: TypeSocketInformation;
  value: string;
}

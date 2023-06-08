export const SocketEvents = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  WEB_APP_USER_LOGIN: 'web_app_user_login',
  WEB_APP_USER_CREATE_CONVERSATION: 'create_conversation',
  WEB_APP_USER_ADDED_CONVERSATION: 'added_conversation',
  WEB_APP_USER_SENT_MESSAGE: 'sent_message',
  WEB_APP_USER_RECEIVE_MESSAGE: 'receive_message',
};

export enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  INVALID_USERNAME_OR_PASSWORD = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  GROUP_HAS_CHILDREN = 410,
  GROUP_MAX_QUANTITY = 412,
  EXCEED_LIMIT = 413,
  FAILED_DEPENDENCY = 424,
  ITEM_NOT_FOUND = 444,
  ITEM_ALREADY_EXIST = 445,
  ITEM_INVALID = 446,
  ITEM_IS_USING = 447,
  USER_HAVE_NOT_PERMISSION = 448,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}
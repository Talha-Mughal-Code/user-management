export const MESSAGE_PATTERNS = {
  USER_REGISTER: 'user.register',
  USER_LOGIN: 'user.login',
  USER_REFRESH: 'user.refresh',
  USER_FIND_ALL: 'user.findAll',
  USER_FIND_BY_ID: 'user.findById',
} as const;

export type MessagePattern = typeof MESSAGE_PATTERNS[keyof typeof MESSAGE_PATTERNS];

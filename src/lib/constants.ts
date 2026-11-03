/**
 * Application-wide business policies and architectural constants.
 */
export const AUTH_CONFIG = {
  TOKEN_EXPIRY: '8h',
  SALT_ROUNDS: 10,
} as const;

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

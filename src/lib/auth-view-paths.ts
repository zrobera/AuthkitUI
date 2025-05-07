export const authViewPaths = {
  callback: "callback",
  forgotPassword: "forgot-password",
  resetPassword: "reset-password",
  settings: "settings",
  signIn: "sign-in",
  signOut: "sign-out",
  signUp: "sign-up",
  twoFactor: "two-factor",
} as const;

export type AuthViewPaths = typeof authViewPaths;
export type AuthView = keyof AuthViewPaths;

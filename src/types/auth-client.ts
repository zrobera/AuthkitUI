import type {
  adminClient,
  organizationClient,
  twoFactorClient,
  usernameClient,
} from "better-auth/client/plugins";
import type { createAuthClient } from "better-auth/react";

type UsernameClientPlugin = ReturnType<typeof usernameClient>;
type TwoFactorClientPlugin = ReturnType<typeof twoFactorClient>;
type AdminClientPlugin = ReturnType<typeof adminClient>;
type OrganizationClientPlugin = ReturnType<typeof organizationClient>;

export type AuthClient = ReturnType<
  typeof createAuthClient<{
    plugins: [
      AdminClientPlugin,
      UsernameClientPlugin,
      TwoFactorClientPlugin,
      OrganizationClientPlugin
    ];
  }>
>;

export type Session = AuthClient["$Infer"]["Session"]["session"];
export type User = AuthClient["$Infer"]["Session"]["user"];

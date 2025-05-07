import type {
    anonymousClient,
    emailOTPClient,
    genericOAuthClient,
    magicLinkClient,
    oneTapClient,
    passkeyClient,
    twoFactorClient,
    usernameClient
} from "auth-kit/client/plugins"
import type { createAuthClient } from "auth-kit/react"

type PasskeyClientPlugin = ReturnType<typeof passkeyClient>
type OneTapClientPlugin = ReturnType<typeof oneTapClient>
type GenericOAuthClientPlugin = ReturnType<typeof genericOAuthClient>
type AnonymousClientPlugin = ReturnType<typeof anonymousClient>
type UsernameClientPlugin = ReturnType<typeof usernameClient>
type MagicLinkClientPlugin = ReturnType<typeof magicLinkClient>
type EmailOTPClientPlugin = ReturnType<typeof emailOTPClient>
type TwoFactorClientPlugin = ReturnType<typeof twoFactorClient>

export type AuthClient = ReturnType<
    typeof createAuthClient<{
        plugins: [
            PasskeyClientPlugin,
            OneTapClientPlugin,
            GenericOAuthClientPlugin,
            AnonymousClientPlugin,
            UsernameClientPlugin,
            MagicLinkClientPlugin,
            EmailOTPClientPlugin,
            TwoFactorClientPlugin
        ]
    }>
>

export type Session = AuthClient["$Infer"]["Session"]["session"]
export type User = AuthClient["$Infer"]["Session"]["user"]

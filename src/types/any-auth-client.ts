import type { createAuthClient } from "auth-kit/react"

export type AnyAuthClient = Omit<ReturnType<typeof createAuthClient>, "signUp" | "getSession">

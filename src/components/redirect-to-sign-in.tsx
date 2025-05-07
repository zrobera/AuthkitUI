"use client"

import type { ReactNode } from "react"
import { useAuthenticate } from "../hooks/use-authenticate"

export function RedirectToSignIn(): ReactNode {
    useAuthenticate({ authView: "signIn" })
    return null
}

"use client"

import type { ReactNode } from "react"
import { useAuthenticate } from "../hooks/use-authenticate"


export function RedirectToSignUp(): ReactNode {
    useAuthenticate({ authView: "signUp" })
    return null
}

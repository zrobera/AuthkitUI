import type { ReactNode } from "react"

export type Link = React.ComponentType<{
    href: string
    className?: string
    children: ReactNode
}>

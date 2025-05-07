"use client"

import type { ReactNode } from "react"

import { cn } from "../../../lib/utils"
import { Card } from "../../ui/card"
import type { UserAvatarClassNames } from "../../user-avatar"
import { SettingsCardFooter } from "./settings-card-footer"
import { SettingsCardHeader } from "./settings-card-header"

export type SettingsCardClassNames = {
    base?: string
    avatar?: UserAvatarClassNames
    button?: string
    cell?: string
    checkbox?: string
    destructiveButton?: string
    content?: string
    description?: string
    dialog?: {
        content?: string
        footer?: string
        header?: string
    }
    error?: string
    footer?: string
    header?: string
    icon?: string
    input?: string
    instructions?: string
    label?: string
    primaryButton?: string
    secondaryButton?: string
    outlineButton?: string
    skeleton?: string
    title?: string
}

export interface SettingsCardProps {
    children?: ReactNode
    className?: string
    classNames?: SettingsCardClassNames
    title: ReactNode
    description?: ReactNode
    instructions?: ReactNode
    actionLabel?: ReactNode
    isSubmitting?: boolean
    disabled?: boolean
    isPending?: boolean
    optimistic?: boolean
    variant?: "default" | "destructive"
    action?: () => Promise<unknown> | unknown
}

export function SettingsCard({
    children,
    className,
    classNames,
    title,
    description,
    instructions,
    actionLabel,
    disabled,
    isPending,
    isSubmitting,
    optimistic,
    variant,
    action
}: SettingsCardProps) {
    return (
        <Card
            className={cn(
                "w-full pb-0 text-start",
                variant === "destructive" && "border-destructive/40",
                className,
                classNames?.base
            )}
        >
            <SettingsCardHeader
                classNames={classNames}
                description={description}
                isPending={isPending}
                title={title}
            />

            {children}

            <SettingsCardFooter
                classNames={classNames}
                actionLabel={actionLabel}
                disabled={disabled}
                isPending={isPending}
                isSubmitting={isSubmitting}
                instructions={instructions}
                optimistic={optimistic}
                variant={variant}
                action={action}
            />
        </Card>
    )
}

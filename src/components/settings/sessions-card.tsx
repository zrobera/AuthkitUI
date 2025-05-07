"use client"

import type { Session } from "better-auth"
import { useContext } from "react"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn } from "../../lib/utils"
import { CardContent } from "../ui/card"
import { SessionCell } from "./session-cell"
import { SettingsCard } from "./shared/settings-card"
import type { SettingsCardClassNames } from "./shared/settings-card"
import { SettingsCellSkeleton } from "./skeletons/settings-cell-skeleton"
import { authLocalization } from "../../lib/auth-localization"

export interface SessionsCardProps {
    className?: string
    classNames?: SettingsCardClassNames
    isPending?: boolean
    sessions?: Session[] | null
    skipHook?: boolean
    refetch?: () => Promise<void>
}

export function SessionsCard({
    className,
    classNames,
    isPending,
    sessions,
    skipHook,
    refetch
}: SessionsCardProps) {
    const {
        hooks: { useListSessions },
    } = useContext(AuthUIContext)

    const localization = authLocalization
    if (!skipHook) {
        const result = useListSessions()
        sessions = result.data
        isPending = result.isPending
        refetch = result.refetch
    }

    return (
        <SettingsCard
            className={className}
            classNames={classNames}
            description={localization.sessionsDescription}
            isPending={isPending}
            title={localization.sessions}
        >
            <CardContent className={cn("grid gap-4", classNames?.content)}>
                {isPending ? (
                    <SettingsCellSkeleton classNames={classNames} />
                ) : (
                    sessions?.map((session) => (
                        <SessionCell
                            key={session.id}
                            classNames={classNames}
                            session={session}
                            refetch={refetch}
                        />
                    ))
                )}
            </CardContent>
        </SettingsCard>
    )
}

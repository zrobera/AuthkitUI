"use client"

import { useContext } from "react"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import { socialProviders } from "../../lib/social-providers"
import { cn } from "../../lib/utils"
import { CardContent } from "../ui/card"
import { ProviderCell } from "./provider-cell"
import { SettingsCard } from "./shared/settings-card"
import type { SettingsCardClassNames } from "./shared/settings-card"
import { SettingsCellSkeleton } from "./skeletons/settings-cell-skeleton"
import { authLocalization } from "../../lib/auth-localization"

export interface ProvidersCardProps {
    className?: string
    classNames?: SettingsCardClassNames
    accounts?: { accountId: string; provider: string }[] | null
    isPending?: boolean
    skipHook?: boolean
}

export function ProvidersCard({
    className,
    classNames,
    isPending,
    skipHook,
    accounts
}: ProvidersCardProps) {
    const {
        hooks: { useListAccounts },
        providers
    } = useContext(AuthUIContext)

    const localization = authLocalization

    if (!skipHook) {
        const result = useListAccounts()
        accounts = result.data
        isPending = result.isPending
    }

    return (
        <SettingsCard
            className={className}
            classNames={classNames}
            title={localization.providers}
            description={localization.providersDescription}
            isPending={isPending}
        >
            <CardContent className={cn("grid gap-4", classNames?.content)}>
                {isPending ? (
                    <SettingsCellSkeleton classNames={classNames} />
                ) : (
                    <>
                        {providers?.map((provider) => {
                            const socialProvider = socialProviders.find(
                                (socialProvider) => socialProvider.provider === provider
                            )

                            if (!socialProvider || !accounts?.find((acc) => acc.provider === provider)) return null

                            return (
                                <ProviderCell
                                    key={provider}
                                    classNames={classNames}
                                    provider={socialProvider}
                                />
                            )
                        })}
                    </>
                )}
            </CardContent>
        </SettingsCard>
    )
}

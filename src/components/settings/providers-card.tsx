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
    refetch?: () => Promise<void>
}

export function ProvidersCard({
    className,
    classNames,
    accounts,
    isPending,
    skipHook,
    refetch
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
        refetch = result.refetch
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

                            if (!socialProvider) return null

                            return (
                                <ProviderCell
                                    key={provider}
                                    classNames={classNames}
                                    account={accounts?.find((acc) => acc.provider === provider)}
                                    provider={socialProvider}
                                    refetch={refetch}
                                />
                            )
                        })}
                    </>
                )}
            </CardContent>
        </SettingsCard>
    )
}

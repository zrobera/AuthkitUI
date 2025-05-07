"use client"

import { useContext, useState } from "react"

import { authLocalization } from "../../lib/auth-localization";
import { AuthUIContext } from "../../lib/auth-ui-provider"
import { DeleteAccountDialog } from "./delete-account-dialog"
import { SettingsCard } from "./shared/settings-card"
import type { SettingsCardClassNames } from "./shared/settings-card"

export interface DeleteAccountCardProps {
    className?: string
    classNames?: SettingsCardClassNames
    accounts?: { provider: string }[] | null
    isPending?: boolean
    skipHook?: boolean
}

export function DeleteAccountCard({
    className,
    classNames,
    accounts,
    isPending,
    skipHook
}: DeleteAccountCardProps) {
    const {
        hooks: { useListAccounts },
    } = useContext(AuthUIContext)

    const localization = authLocalization

    const [showDialog, setShowDialog] = useState(false)

    if (!skipHook) {
        const result = useListAccounts()
        accounts = result.data
        isPending = result.isPending
    }

    return (
        <div>
            <SettingsCard
                className={className}
                classNames={classNames}
                actionLabel={localization?.deleteAccount}
                description={localization?.deleteAccountDescription}
                isPending={isPending}
                title={localization?.deleteAccount}
                variant="destructive"
                action={() => setShowDialog(true)}
            />

            <DeleteAccountDialog
                classNames={classNames}
                accounts={accounts}
                open={showDialog}
                onOpenChange={setShowDialog}
            />
        </div>
    )
}

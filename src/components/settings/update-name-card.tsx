"use client"

import { useContext } from "react"

import { authLocalization } from "../../lib/auth-localization"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import type { SettingsCardClassNames } from "./shared/settings-card"
import { UpdateFieldCard } from "./shared/update-field-card"

export interface UpdateNameCardProps {
    className?: string
    classNames?: SettingsCardClassNames
    isPending?: boolean
}

export function UpdateNameCard({
    className,
    classNames,
    isPending,
}: UpdateNameCardProps) {
    const {
        hooks: { useSession },
        nameRequired
    } = useContext(AuthUIContext)

    const localization = authLocalization

    const { data: sessionData } = useSession()

    return (
        <UpdateFieldCard
            className={className}
            classNames={classNames}
            value={sessionData?.user.name}
            description={localization.nameDescription}
            name="name"
            instructions={localization.nameInstructions}
            isPending={isPending}
            label={localization.name}
            placeholder={localization.namePlaceholder}
            required={nameRequired}
        />
    )
}

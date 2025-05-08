"use client";
import { KeyIcon, UserIcon } from "lucide-react"
import { useContext } from "react"

import { useAuthenticate } from "../../hooks/use-authenticate"
import { authLocalization } from "../../lib/auth-localization"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn } from "../../lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { ChangeEmailCard } from "./change-email-card"
import { ChangePasswordCard } from "./change-password-card"
import { DeleteAccountCard } from "./delete-account-card"
import { ProvidersCard } from "./providers-card"
import { SessionsCard } from "./sessions-card"
import type { SettingsCardClassNames } from "./shared/settings-card"
import { UpdateFieldCard } from "./shared/update-field-card"
import { UpdateNameCard } from "./update-name-card"

export type SettingsCardsClassNames = {
    base?: string
    card?: SettingsCardClassNames
    tabs?: {
        base?: string
        list?: string
        trigger?: string
        content?: string
    }
}

export interface SettingsCardsProps {
    className?: string
    classNames?: SettingsCardsClassNames
}

export function SettingsCards({ className, classNames }: SettingsCardsProps) {
    useAuthenticate()

    const {
        additionalFields,
        credentials,
        changeEmail,
        deleteUser,
        hooks,
        nameRequired,
        providers,
        settingsFields
    } = useContext(AuthUIContext)

    const localization = authLocalization

    const { useListAccounts, useListSessions, useSession } =
        hooks
    const { data: sessionData, isPending: sessionPending } = useSession()

    const {
        data: accounts,
        isPending: accountsPending,
        refetch: refetchAccounts
    } = useListAccounts()

    const {
        data: sessions,
        isPending: sessionsPending,
        refetch: refetchSessions
    } = useListSessions()

    return (
        <div
            className={cn(
                "flex w-full max-w-xl grow flex-col items-center gap-4",
                className,
                classNames?.base
            )}
        >
            <Tabs
                defaultValue="account"
                className={cn("flex w-full flex-col gap-4", classNames?.tabs?.base)}
            >
                <TabsList className={cn("grid w-full grid-cols-2", classNames?.tabs?.list)}>
                    <TabsTrigger value="account" className={classNames?.tabs?.trigger}>
                        <UserIcon className={classNames?.card?.icon} />

                        {localization.account}
                    </TabsTrigger>

                    <TabsTrigger value="security" className={classNames?.tabs?.trigger}>
                        <KeyIcon className={classNames?.card?.icon} />

                        {localization.security}
                    </TabsTrigger>
                </TabsList>

                <TabsContent
                    value="account"
                    className={cn("flex flex-col gap-4", classNames?.tabs?.content)}
                >
                    {(settingsFields?.includes("name") || nameRequired) && (
                        <UpdateNameCard
                            classNames={classNames?.card}
                            isPending={sessionPending}
                        />
                    )}

                    {changeEmail && (
                        <ChangeEmailCard
                            classNames={classNames?.card}
                            isPending={sessionPending}
                        />
                    )}

                    {settingsFields?.map((field) => {
                        const additionalField = additionalFields?.[field]
                        if (!additionalField) return null

                        const {
                            label,
                            description,
                            instructions,
                            placeholder,
                            required,
                            type,
                            validate
                        } = additionalField

                        // @ts-ignore Custom fields are not typed
                        const defaultValue = sessionData?.user[field] as unknown

                        return (
                            <UpdateFieldCard
                                key={field}
                                classNames={classNames?.card}
                                value={defaultValue}
                                description={description}
                                name={field}
                                instructions={instructions}
                                isPending={sessionPending}
                                label={label}
                                placeholder={placeholder}
                                required={required}
                                type={type}
                                validate={validate}
                            />
                        )
                    })}
                </TabsContent>

                <TabsContent
                    value="security"
                    className={cn("flex flex-col gap-4", classNames?.tabs?.content)}
                >
                    {credentials && (
                        <ChangePasswordCard
                                                accounts={accounts}
                            classNames={classNames?.card}
                            isPending={sessionPending}
                            skipHook
                        />
                    )}

                    {(providers?.length) && (
                        <ProvidersCard
                            accounts={accounts}
                            classNames={classNames?.card}
                            isPending={accountsPending}
                            skipHook
                        />
                    )}
                    <SessionsCard
                        classNames={classNames?.card}
                        isPending={sessionsPending}
                        sessions={sessions}
                        refetch={refetchSessions}
                        skipHook
                    />

                    {deleteUser && (
                        <DeleteAccountCard
                            accounts={accounts}
                            classNames={classNames?.card}
                            isPending={sessionPending}
                            skipHook
                        />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}

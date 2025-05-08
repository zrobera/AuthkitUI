"use client";
import { useContext } from "react";

import { AuthUIContext } from "../../lib/auth-ui-provider"
import type { Provider } from "../../lib/social-providers"
import { cn } from "../../lib/utils";
import { Card } from "../ui/card"
import type { SettingsCardClassNames } from "./shared/settings-card"

export interface ProviderCellProps {
    className?: string
    classNames?: SettingsCardClassNames
    provider: Provider
}

export function ProviderCell({
    className,
    classNames,
    provider,
}: ProviderCellProps) {
    const {
        noColorIcons,
    } = useContext(AuthUIContext)

    return (
        <Card className={cn("flex-row items-center gap-3 px-4 py-3", className, classNames?.cell)}>
            {provider.icon &&
                (noColorIcons ? (
                    <provider.icon className={cn("size-4", classNames?.icon)} />
                ) : (
                    <>
                        <provider.icon
                            className={cn("size-4 dark:hidden", classNames?.icon)}
                            variant="color"
                        />
                        <provider.icon
                            className={cn("hidden size-4 dark:block", classNames?.icon)}
                        />
                    </>
                ))}

            <span className="text-sm">{provider.name}</span>
        </Card>
    )
}

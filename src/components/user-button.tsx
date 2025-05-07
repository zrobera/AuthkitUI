"use client";

import type { Session, User } from "better-auth";
import {
  ChevronsUpDown,
  LogInIcon,
  LogOutIcon,
  PlusCircleIcon,
  SettingsIcon,
  UserRoundPlus,
} from "lucide-react";
import {
  Fragment,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  type AuthLocalization,
  authLocalization,
} from "../lib/auth-localization";
import { AuthUIContext } from "../lib/auth-ui-provider";
import { getLocalizedError } from "../lib/utils";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { UserAvatar, type UserAvatarClassNames } from "./user-avater";
import { UserView, type UserViewClassNames } from "./user-view";

export interface UserButtonClassNames {
  base?: string;
  skeleton?: string;
  trigger?: {
    base?: string;
    avatar?: UserAvatarClassNames;
    user?: UserViewClassNames;
    skeleton?: string;
  };
  content?: {
    base?: string;
    user?: UserViewClassNames;
    avatar?: UserAvatarClassNames;
    menuItem?: string;
    separator?: string;
  };
}

export interface UserButtonProps {
  className?: string;
  classNames?: UserButtonClassNames;
  additionalLinks?: {
    href: string;
    icon?: ReactNode;
    label: ReactNode;
    signedIn?: boolean;
  }[];
  disableDefaultLinks?: boolean;
}

/**
 * Displays an interactive user button with dropdown menu functionality
 *
 * Renders a user interface element that can be displayed as either an icon or full button:
 * - Shows a user avatar or placeholder when in icon mode
 * - Displays user name and email with dropdown indicator in full mode
 * - Provides dropdown menu with authentication options (sign in/out, settings, etc.)
 * - Supports multi-session functionality for switching between accounts
 * - Can be customized with additional links and styling options
 */
export function UserButton({
  className,
  classNames,
  additionalLinks,
  disableDefaultLinks,
}: UserButtonProps) {
  const {
    basePath,
    hooks: { useSession },
    settingsURL,
    signUp,
    viewPaths,
    Link,
  } = useContext(AuthUIContext);

  const localization = { ...authLocalization };

  const { data: sessionData, isPending: sessionPending } = useSession();
  const user = sessionData?.user;

  const isPending = sessionPending;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn("rounded-full", classNames?.trigger?.base)}
      >
        <UserAvatar
          key={user?.image}
          isPending={isPending}
          className={cn("size-8", className, classNames?.base)}
          classNames={classNames?.trigger?.avatar}
          user={user}
          aria-label={localization.account}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={cn("max-w-64", classNames?.content?.base)}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className={cn("p-2", classNames?.content?.menuItem)}>
          {(user) || isPending ? (
            <UserView
              user={user}
              isPending={isPending}
              classNames={classNames?.content?.user}
            />
          ) : (
            <div className="-my-1 text-muted-foreground text-xs">
              {localization.account}
            </div>
          )}
        </div>

        <DropdownMenuSeparator className={classNames?.content?.separator} />

        {additionalLinks?.map(
          ({ href, icon, label, signedIn }, index) =>
            (signedIn === undefined ||
              (signedIn && !!sessionData) ||
              (!signedIn && !sessionData)) && (
              <Link key={index} href={href}>
                <DropdownMenuItem className={classNames?.content?.menuItem}>
                  {icon}
                  {label}
                </DropdownMenuItem>
              </Link>
            )
        )}

        {!user ? (
          <>
            <Link href={`${basePath}/${viewPaths.signIn}`}>
              <DropdownMenuItem className={classNames?.content?.menuItem}>
                <LogInIcon />
                {localization.signIn}
              </DropdownMenuItem>
            </Link>

            {signUp && (
              <Link href={`${basePath}/${viewPaths.signUp}`}>
                <DropdownMenuItem className={classNames?.content?.menuItem}>
                  <UserRoundPlus />
                  {localization.signUp}
                </DropdownMenuItem>
              </Link>
            )}
          </>
        ) : (
          <>
            {!disableDefaultLinks && (
              <Link href={settingsURL || `${basePath}/${viewPaths.settings}`}>
                <DropdownMenuItem className={classNames?.content?.menuItem}>
                  <SettingsIcon />
                  {localization.settings}
                </DropdownMenuItem>
              </Link>
            )}

            <Link href={`${basePath}/${viewPaths.signOut}`}>
              <DropdownMenuItem className={classNames?.content?.menuItem}>
                <LogOutIcon />
                {localization.signOut}
              </DropdownMenuItem>
            </Link>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { ArrowLeftIcon, Loader2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";

import { useIsHydrated } from "../../hooks/use-hydrated";
import {
  type AuthLocalization,
  authLocalization,
} from "../../lib/auth-localization";
import { AuthUIContext } from "../../lib/auth-ui-provider";
import type { AuthView } from "../../lib/auth-view-paths";
import { socialProviders } from "../../lib/social-providers";
import { cn, getAuthViewByPath } from "../../lib/utils";
import {
  SettingsCards,
  type SettingsCardsClassNames,
} from "../settings/settings-cards";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { AuthCallback } from "./auth-callback";
import { AuthForm, type AuthFormClassNames } from "./auth-form";
import { ProviderButton } from "./provider-button";
import { SignOut } from "./sign-out";

export interface AuthCardClassNames {
  base?: string;
  content?: string;
  description?: string;
  footer?: string;
  footerLink?: string;
  form?: AuthFormClassNames;
  header?: string;
  separator?: string;
  settings?: SettingsCardsClassNames;
  title?: string;
}

export interface AuthCardProps {
  className?: string;
  classNames?: AuthCardClassNames;
  callbackURL?: string;
  pathname?: string;
  redirectTo?: string;
  socialLayout?: "auto" | "horizontal" | "grid" | "vertical";
  view?: AuthView;
  otpSeparators?: 0 | 1 | 2;
}

export function AuthCard({
  className,
  classNames,
  callbackURL,
  pathname,
  redirectTo,
  socialLayout = "auto",
  view,
  otpSeparators = 0,
}: AuthCardProps) {
  const isHydrated = useIsHydrated();

  const {
    basePath,
    credentials,
    providers,
    settingsURL,
    signUp,
    viewPaths,
    replace,
    Link,
  } = useContext(AuthUIContext);

  const localization = { ...authLocalization };

  if (socialLayout === "auto") {
    socialLayout = !credentials
      ? "vertical"
      : providers && providers.length > 2
      ? "horizontal"
      : "vertical";
  }

  const path = pathname?.split("/").pop();
  view = view || getAuthViewByPath(viewPaths, path) || "signIn";

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      setIsSubmitting(false);
    };
  }, []);

  useEffect(() => {
    if (view === "settings" && settingsURL) replace(settingsURL);
  }, [replace, settingsURL, view]);

  if (view === "callback") return <AuthCallback redirectTo={redirectTo} />;
  if (view === "signOut") return <SignOut />;

  if (view === "settings")
    return settingsURL ? (
      <Loader2 className="animate-spin" />
    ) : (
      <SettingsCards
        className={cn(className)}
        classNames={classNames?.settings}
      />
    );

  const description = !credentials
    ? localization.disabledCredentialsDescription
    : localization[`${view}Description` as keyof typeof localization];

  return (
    <Card className={cn("w-full max-w-sm", className, classNames?.base)}>
      <CardHeader className={classNames?.header}>
        <CardTitle className={cn("text-lg md:text-xl", classNames?.title)}>
          {localization[view as keyof typeof localization]}
        </CardTitle>

        {description && (
          <CardDescription
            className={cn("text-xs md:text-sm", classNames?.description)}
          >
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className={cn("grid gap-6", classNames?.content)}>
        {credentials && (
          <div className="grid gap-4">
            <AuthForm
              classNames={classNames?.form}
              isSubmitting={isSubmitting}
              localization={localization}
              otpSeparators={otpSeparators}
              pathname={pathname}
              redirectTo={redirectTo}
              setIsSubmitting={setIsSubmitting}
            />
          </div>
        )}

        {view !== "resetPassword" && providers?.length && (
          <>
            {credentials && (
              <div className="flex items-center gap-2">
                <Separator
                  className={cn("!w-auto grow", classNames?.separator)}
                />

                <span className="flex-shrink-0 text-muted-foreground text-sm">
                  {localization.orContinueWith}
                </span>

                <Separator
                  className={cn("!w-auto grow", classNames?.separator)}
                />
              </div>
            )}

            <div className="grid gap-4">
              {providers?.length && (
                <div
                  className={cn(
                    "flex w-full items-center justify-between gap-4",
                    socialLayout === "horizontal" && "flex-wrap",
                    socialLayout === "vertical" && "flex-col",
                    socialLayout === "grid" && "grid grid-cols-2"
                  )}
                >
                  {providers?.map((provider) => {
                    const socialProvider = socialProviders.find(
                      (socialProvider) => socialProvider.provider === provider
                    );
                    if (!socialProvider) return null;

                    return (
                      <ProviderButton
                        key={provider}
                        classNames={classNames}
                        callbackURL={callbackURL}
                        isSubmitting={isSubmitting}
                        localization={localization}
                        provider={socialProvider}
                        redirectTo={redirectTo}
                        setIsSubmitting={setIsSubmitting}
                        socialLayout={socialLayout}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>

      {credentials && signUp && (
        <CardFooter
          className={cn(
            "justify-center gap-1.5 text-muted-foreground text-sm",
            classNames?.footer
          )}
        >
          {view === "signIn" ? (
            localization.dontHaveAnAccount
          ) : view === "signUp" ? (
            localization.alreadyHaveAnAccount
          ) : (
            <ArrowLeftIcon className="size-3" />
          )}

          {view === "signIn" || view === "signUp" ? (
            <Link
              className={cn(
                "text-foreground underline",
                classNames?.footerLink
              )}
              href={`${basePath}/${
                viewPaths[view === "signIn" ? "signUp" : "signIn"]
              }${isHydrated ? window.location.search : ""}`}
            >
              <Button
                variant="link"
                size="sm"
                className={cn(
                  "px-0 text-foreground underline",
                  classNames?.footerLink
                )}
              >
                {view === "signIn" ? localization.signUp : localization.signIn}
              </Button>
            </Link>
          ) : (
            <Button
              variant="link"
              size="sm"
              className={cn(
                "px-0 text-foreground underline",
                classNames?.footerLink
              )}
              onClick={() => window.history.back()}
            >
              {localization.goBack}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

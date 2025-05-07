import type { SocialProvider } from "better-auth/social-providers";
import { useCallback, useContext } from "react";

import type { AuthLocalization } from "../../lib/auth-localization";
import { AuthUIContext } from "../../lib/auth-ui-provider";
import type { Provider } from "../../lib/social-providers";
import { cn, getLocalizedError, getSearchParam } from "../../lib/utils";
import type { AuthClient } from "../../types/auth-client";
import { Button } from "../ui/button";
import type { AuthCardClassNames } from "./auth-card";

interface ProviderButtonProps {
  className?: string;
  classNames?: AuthCardClassNames;
  callbackURL?: string;
  isSubmitting: boolean;
  localization: Partial<AuthLocalization>;
  provider: Provider;
  redirectTo?: string;
  socialLayout: "auto" | "horizontal" | "grid" | "vertical";
  setIsSubmitting: (isSubmitting: boolean) => void;
}

export function ProviderButton({
  className,
  classNames,
  callbackURL: callbackURLProp,
  isSubmitting,
  localization,
  provider,
  redirectTo: redirectToProp,
  socialLayout,
  setIsSubmitting,
}: ProviderButtonProps) {
  const {
    authClient,
    basePath,
    baseURL,
    redirectTo: contextRedirectTo,
    viewPaths,
    toast,
  } = useContext(AuthUIContext);

  const getRedirectTo = useCallback(
    () => redirectToProp || getSearchParam("redirectTo") || contextRedirectTo,
    [redirectToProp, contextRedirectTo]
  );

  const getCallbackURL = useCallback(
    () => `${baseURL}${callbackURLProp || getRedirectTo()}`,
    [callbackURLProp, basePath, viewPaths, baseURL, getRedirectTo]
  );

  const doSignInSocial = async () => {
    setIsSubmitting(true);

    try {
      const socialParams = {
        provider: provider.provider as SocialProvider,
        callbackURL: getCallbackURL(),
        fetchOptions: { throw: true },
      };
      await authClient.signIn.social(socialParams);
    } catch (error) {
      toast({
        variant: "error",
        message: getLocalizedError({ error, localization }),
      });

      setIsSubmitting(false);
    }
  };

  return (
    <Button
      className={cn(
        socialLayout === "vertical" ? "w-full" : "grow",
        className,
        classNames?.form?.button,
        classNames?.form?.outlineButton,
        classNames?.form?.providerButton
      )}
      disabled={isSubmitting}
      variant="outline"
      onClick={doSignInSocial}
    >
      {provider.icon && (
        <>
          <provider.icon
            className={cn("dark:hidden", classNames?.form?.icon)}
            variant="color"
          />
          <provider.icon
            className={cn("hidden dark:block", classNames?.form?.icon)}
          />
        </>
      )}

      {socialLayout === "grid" && provider.name}
      {socialLayout === "vertical" &&
        `${localization.signInWith} ${provider.name}`}
    </Button>
  );
}

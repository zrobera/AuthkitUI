"use client";

import { useContext, useEffect } from "react";

import type { AuthLocalization } from "../../lib/auth-localization";
import { AuthUIContext } from "../../lib/auth-ui-provider";
import type { AuthView } from "../../lib/auth-view-paths";
import { getAuthViewByPath } from "../../lib/utils";
import { AuthCallback } from "./auth-callback";
import { ForgotPasswordForm } from "./forms/forgot-password-form";
import { ResetPasswordForm } from "./forms/reset-password-form";
import { SignInForm } from "./forms/sign-in-form";
import { SignUpForm } from "./forms/sign-up-form";
import { SignOut } from "./sign-out";

export type AuthFormClassNames = {
  base?: string;
  button?: string;
  checkbox?: string;
  description?: string;
  error?: string;
  forgotPasswordLink?: string;
  icon?: string;
  input?: string;
  label?: string;
  outlineButton?: string;
  primaryButton?: string;
  providerButton?: string;
  qrCode?: string;
  secondaryButton?: string;
};

export interface AuthFormProps {
  className?: string;
  classNames?: AuthFormClassNames;
  isSubmitting?: boolean;
  localization?: Partial<AuthLocalization>;
  pathname?: string;
  redirectTo?: string;
  view?: AuthView;
  otpSeparators?: 0 | 1 | 2;
  setIsSubmitting?: (isSubmitting: boolean) => void;
}

export function AuthForm({
  className,
  classNames,
  isSubmitting,
  localization,
  pathname,
  redirectTo,
  view,
  setIsSubmitting,
}: AuthFormProps) {
  const {
    basePath,
    credentials,
    signUp: signUpEnabled,
    viewPaths,
    replace,
  } = useContext(AuthUIContext);

  localization = { ...localization };

  const path = pathname?.split("/").pop();

  useEffect(() => {
    if (path && !getAuthViewByPath(viewPaths, path)) {
      replace(`${basePath}/${viewPaths.signIn}${window.location.search}`);
    }
  }, [path, viewPaths, basePath, replace]);

  view = view || getAuthViewByPath(viewPaths, path) || "signIn";

  useEffect(() => {
    let isInvalidView = false;

    if (view === "signUp" && !signUpEnabled) {
      isInvalidView = true;
    }
    if (
      !credentials &&
      ["signUp", "forgotPassword", "resetPassword"].includes(view)
    ) {
      isInvalidView = true;
    }

    if (isInvalidView) {
      replace(`${basePath}/${viewPaths.signIn}${window.location.search}`);
    }
  }, [basePath, view, viewPaths, credentials, replace, signUpEnabled]);

  if (view === "signOut") return <SignOut />;
  if (view === "callback") return <AuthCallback redirectTo={redirectTo} />;

  if (view === "signIn") {
    return (
      credentials && (
        <SignInForm
          className={className}
          classNames={classNames}
          localization={localization}
          redirectTo={redirectTo}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      )
    );
  }

  if (view === "forgotPassword") {
    return (
      <ForgotPasswordForm
        className={className}
        classNames={classNames}
        localization={localization}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />
    );
  }

  if (view === "resetPassword") {
    return (
      <ResetPasswordForm
        className={className}
        classNames={classNames}
        localization={localization}
      />
    );
  }

  if (view === "signUp") {
    return (
      signUpEnabled && (
        <SignUpForm
          className={className}
          classNames={classNames}
          redirectTo={redirectTo}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      )
    );
  }
}

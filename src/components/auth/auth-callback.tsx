"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

import { useOnSuccessTransition } from "../../hooks/use-success-transition";

export function AuthCallback({ redirectTo }: { redirectTo?: string }) {
  const isRedirecting = useRef(false);

  const { onSuccess } = useOnSuccessTransition({ redirectTo });

  useEffect(() => {
    if (isRedirecting.current) return;
    isRedirecting.current = true;
    onSuccess();
  }, [onSuccess]);

  return <Loader2 className="animate-spin" />;
}

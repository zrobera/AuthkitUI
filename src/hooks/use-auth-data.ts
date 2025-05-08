import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { AuthUIContext } from "../lib/auth-ui-provider";
import type { FetchError } from "../types/fetch-error";

export function useAuthData<T>({ queryFn }: { queryFn: any }) {
  const { authClient, toast } = useContext(AuthUIContext);
  const { data: sessionData, isPending: sessionPending } =
    authClient.useSession();

  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(true);
  const initialized = useRef(false);

  const refetch = useCallback(async () => {
    const { data, error } = await queryFn();

    if (error)
      toast({
        variant: "error",
        message: error.message || "An error occurred",
      });

    setData(data);
    setIsPending(false);
  }, [queryFn, toast]);

  useEffect(() => {
    if (!sessionData) {
      setIsPending(sessionPending);
      setData(null);
      initialized.current = false;
      return;
    }

    if (initialized.current) return;

    initialized.current = true;
    refetch();
  }, [refetch, sessionData, sessionPending]);

  return {
    data,
    isPending,
    refetch,
  };
}

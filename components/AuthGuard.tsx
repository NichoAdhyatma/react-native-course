import { useAuth } from "@/lib/auth-context";
import { useLoader } from "@/lib/loader-context";
import { router, useSegments } from "expo-router";
import { ReactNode, useEffect, useState } from "react";

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { user, isLoadingUser } = useAuth();

  const [isMounted, setIsMounted] = useState(false);

  const segments = useSegments();

  const { setIsLoading } = useLoader();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsLoading(isLoadingUser);
  }, [isLoadingUser, setIsLoading]);

  useEffect(() => {
    const isAuthPage = segments[0] === "auth";

    if (!isMounted) return;

    if (!user && !isAuthPage && !isLoadingUser) {
      router.replace("/auth");
    } else if (user && isAuthPage && !isLoadingUser) {
      router.replace("/");
    }
  }, [user, isMounted, segments, isLoadingUser]);

  return <>{children}</>;
};

export default AuthGuard;

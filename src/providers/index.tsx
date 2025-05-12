"use client";

import { SessionProvider, SessionProviderProps } from "next-auth/react";

type ProvidersProps = React.PropsWithChildren & {
  session: SessionProviderProps["session"];
};

// prettier-ignore
export const Providers = ({ session, children }: ProvidersProps) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
};

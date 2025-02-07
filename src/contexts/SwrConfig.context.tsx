"use client";

import { SWRConfig } from "swr";

type Props = {
  children: React.ReactNode;
};

export default function SWRConfigContext({ children }: Props) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        revalidateOnMount: true,
        dedupingInterval: 500,
        onErrorRetry: (error, _key, _config, revalidate, { retryCount }) => {
          if (error.status === 404) return;
          if (retryCount >= 3) return;
          setTimeout(() => revalidate({ retryCount }), 100);
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}

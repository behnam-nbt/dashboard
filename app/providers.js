'use client';

import { HydrationBoundary, QueryClientProvider, DehydratedState } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/react-query';
import { SessionProvider } from "next-auth/react";

export function Providers({
    children,
    state = null,
}) {
    const queryClient = getQueryClient();

    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <HydrationBoundary state={state}>
                    {children}
                </HydrationBoundary>
            </QueryClientProvider>
        </SessionProvider>
    );
}

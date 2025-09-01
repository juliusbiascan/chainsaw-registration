'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

interface SessionRefreshWrapperProps {
  children: React.ReactNode;
}

export function SessionRefreshWrapper({ children }: SessionRefreshWrapperProps) {
  const { data: session, status, update } = useSession();

  useEffect(() => {
    // Force session refresh on mount if we're authenticated but session data seems incomplete
    if (status === 'authenticated' && session?.user) {
      const hasIncompleteData = !session.user.name || !session.user.email;

      if (hasIncompleteData) {
        console.log('Session data incomplete, refreshing...');
        update();
      }
    }

    // Refresh session on mount if we're on a dashboard page and session seems incomplete
    if (status === 'authenticated' && typeof window !== 'undefined' && window.location.pathname.includes('/dashboard')) {
      const hasIncompleteData = !session?.user?.name || !session?.user?.email;
      if (hasIncompleteData) {
        console.log('On dashboard page with incomplete session, refreshing...');
        update();
      }
    }
  }, [status, session, update]);

  return <>{children}</>;
}

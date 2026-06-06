import { Suspense } from 'react';
import { OAuthCallbackPage } from '@/modules/auth/callback/OAuthCallbackPage';

export default function Page() {
  return (
    <Suspense>
      <OAuthCallbackPage />
    </Suspense>
  );
}

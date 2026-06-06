import { Suspense } from 'react';
import { ConfirmPage } from '@/modules/auth/confirm/ConfirmPage';

export default function Page() {
  return (
    <Suspense>
      <ConfirmPage />
    </Suspense>
  );
}

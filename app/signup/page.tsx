import Signin from '@/component/Signin';
import React from 'react';

export const dynamic = 'force-dynamic';

export default function SignUpPage() {
  return (
    <div className="pt-24 pb-12 bg-fav-off-white min-h-screen">
      <Signin mode="signup" />
    </div>
  );
}

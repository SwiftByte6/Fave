import Signin from '@/component/Signin';
import React from 'react';

export const dynamic = 'force-dynamic';

export default function SigninPage() {
  return (
    <div className="pt-24 pb-12 ">
      <Signin mode="signin" />
    </div>
  );
}

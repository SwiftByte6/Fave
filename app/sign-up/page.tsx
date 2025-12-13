"use client";
import React from 'react';
import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => {
  return (
    <div className='absolute top-0 inset-0 flex items-center justify-center w-full bg-white h-full'>
      <div className='md:w-[40vw] w-full shadow-2xl p-6 '>
        <SignUp 
          afterSignUpUrl="/"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-black hover:bg-gray-800 text-sm normal-case',
              card: 'shadow-2xl',
            }
          }}
        />
      </div>
    </div>
  );
};

export default SignUpPage;

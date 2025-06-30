"use client"
import React from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { supabase } from '@/lib/supabase/products'
import { ThemeSupa } from '@supabase/auth-ui-shared'


const Signin = () => {
    return (
        <div className='absolute top-0 inset-0 flex items-center justify-center w-full bg-white h-full'>
            <div className='md:w-[40vw] w-full shadow-2xl p-6 '>
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                />
            </div>
        </div>
    )
}

export default Signin

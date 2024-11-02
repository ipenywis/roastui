'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FcGoogle } from 'react-icons/fc';
import { signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();

  const redirectUrl =
    searchParams.get('tier') && searchParams.get('plan')
      ? `/subscribe?tier=${searchParams.get('tier')}&plan=${searchParams.get(
          'plan'
        )}`
      : '/subscribe';

  async function loginWithGoogle() {
    await signIn('google', {
      redirectTo: redirectUrl,
    });
  }

  async function loginWithGithub() {
    await signIn('github', { redirectTo: redirectUrl });
  }

  return (
    <div className="w-full h-3/4 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome Back 👋</h1>
      <Card className="w-[350px] mt-20">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-5">
          <Button size="xl" className="w-full" onClick={loginWithGoogle}>
            <FcGoogle className="mr-2 text-xl" /> Continue with Google
          </Button>
          <Button size="xl" className="w-full" onClick={loginWithGithub}>
            <FaGithub className="mr-2 text-xl" /> Continue with Github
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
// import { signIn } from '@/auth';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { RiLoader3Fill } from 'react-icons/ri';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { plan: string; tier: string };
}) {
  const { plan, tier } = searchParams;

  const [isLoggingWithGoogle, setIsLoggingWithGoogle] = useState(false);
  const [isLogginWithGithub, setIsLoggingWithGithub] = useState(false);

  const redirectUrl =
    tier && plan ? `/subscribe?tier=${tier}&plan=${plan}` : '/subscribe';

  async function loginWithGoogle() {
    setIsLoggingWithGoogle(true);
    await signIn('google', {
      redirectTo: redirectUrl,
    });
  }

  async function loginWithGithub() {
    setIsLoggingWithGithub(true);
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
          <Button
            size="xl"
            className="w-full"
            type="submit"
            onClick={loginWithGoogle}
          >
            <FcGoogle className="mr-2 text-xl" /> Continue with Google
            <span className="ml-1 size-4">
              {isLoggingWithGoogle && (
                <RiLoader3Fill className="animate-spin size-4" />
              )}
            </span>
          </Button>
          <Button
            size="xl"
            className="w-full"
            type="submit"
            onClick={loginWithGithub}
          >
            <FaGithub className="mr-2 text-xl" /> Continue with Github
            <span className="ml-1 size-4">
              {isLogginWithGithub && (
                <RiLoader3Fill className="animate-spin size-4" />
              )}
            </span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

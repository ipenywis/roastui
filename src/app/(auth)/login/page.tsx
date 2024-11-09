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
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { signIn } from '@/auth';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { plan: string; tier: string };
}) {
  const { plan, tier } = searchParams;

  const redirectUrl =
    tier && plan ? `/subscribe?tier=${tier}&plan=${plan}` : '/subscribe';

  console.log('URL: ', redirectUrl);

  async function loginWithGoogle() {
    'use server';
    await signIn('google', {
      redirectTo: redirectUrl,
    });
  }

  async function loginWithGithub() {
    'use server';
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
          <form action={loginWithGoogle}>
            <Button size="xl" className="w-full" type="submit">
              <FcGoogle className="mr-2 text-xl" /> Continue with Google
            </Button>
          </form>
          <form action={loginWithGithub}>
            <Button size="xl" className="w-full" type="submit">
              <FaGithub className="mr-2 text-xl" /> Continue with Github
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

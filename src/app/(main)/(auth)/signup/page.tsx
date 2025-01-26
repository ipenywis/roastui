import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FcGoogle } from 'react-icons/fc';
import { signIn } from '@/auth';
import { FaGithub } from 'react-icons/fa';

export const revalidate = 86400;

export default function SignupPage({
  searchParams,
}: {
  searchParams: { plan: string; tier: string };
}) {
  const { plan, tier } = searchParams;

  const redirectUrl =
    tier && plan ? `/subscribe?tier=${tier}&plan=${plan}` : '/subscribe';

  async function signupWithGoogle() {
    'use server';
    await signIn('google', { redirectTo: redirectUrl });
  }

  async function loginWithGithub() {
    'use server';
    await signIn('github', { redirectTo: redirectUrl });
  }

  return (
    <div className="w-full h-3/4 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-center">No More Design Flaws</h1>
      <Card className="w-[350px] mt-20">
        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardDescription>Create an account to continue</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-5">
          <form action={signupWithGoogle}>
            <Button size="xl" className="w-full">
              <FcGoogle className="mr-2 text-xl" /> Continue with Google
            </Button>
          </form>
          <form action={loginWithGithub}>
            <Button size="xl" className="w-full">
              <FaGithub className="mr-2 text-xl" /> Continue with Github
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

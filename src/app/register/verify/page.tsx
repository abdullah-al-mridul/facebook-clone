
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  otp: z.string().min(6, { message: 'Your code must be 6 characters.' }),
});

export default function VerifyPage() {
  const [showResend, setShowResend] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Handle OTP verification logic here
  }

  const handleResendCode = () => {
    // Logic to resend code would go here
    toast({
        title: "Code resent!",
        description: "A new confirmation code has been sent to your email.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-zinc-900 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className='text-center'>
          <CardTitle className="text-2xl font-bold">Enter confirmation code</CardTitle>
          <CardDescription>
            Enter the code we sent to your email. If you don't see it, check your spam folder.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Confirmation code" {...field} className="py-6 text-base text-center" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <div>
                {showResend ? (
                    <Button variant="link" type="button" onClick={handleResendCode} className="p-0 text-primary hover:underline">
                        Resend code
                    </Button>
                ) : (
                    <Link href="#" onClick={(e) => { e.preventDefault(); setShowResend(true); }} className="text-sm text-primary hover:underline">
                        Didn't get a code?
                    </Link>
                )}
                </div>
                <Button type="submit">
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

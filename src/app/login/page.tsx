
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Handle login logic here
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-zinc-900 p-4">
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-primary mb-2">Facemusk</h1>
                <p className="text-xl text-foreground">Connect with friends and the world around you on Facemusk.</p>
            </div>
            <Card className="shadow-2xl">
                <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <Input placeholder="Email address" {...field} className="py-6 text-base"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <Input type="password" placeholder="Password" {...field} className="py-6 text-base"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full h-12 text-lg font-bold">
                        Log In
                    </Button>
                    </form>
                </Form>
                 <div className="text-center mt-4">
                    <Link href="#" className="text-sm text-primary hover:underline">
                        Forgot password?
                    </Link>
                </div>
                </CardContent>
                <CardFooter className="flex justify-center p-6 border-t">
                     <Link href="/register">
                        <Button variant="secondary" className="bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-6 text-lg">
                            Create new account
                        </Button>
                     </Link>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}

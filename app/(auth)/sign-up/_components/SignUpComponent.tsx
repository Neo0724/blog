"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignUpSchema } from "@/zod_schema/schema";
type SignUpType = z.infer<typeof SignUpSchema>;

export default function SignUpComponent() {
  const form = useForm<SignUpType>({
    resolver: zodResolver(SignUpSchema),
  });

  const [toastMessage, setToastMessage] = useState({ msg: "", error: false });
  const router = useRouter();

  const waitClearToast = () => {
    return new Promise((resolve) => {
      const timeOut = setTimeout(() => {
        setToastMessage({ msg: "", error: false });
        resolve(true);
      }, 2000);

      return () => clearTimeout(timeOut);
    });
  };

  const handleSubmit = form.handleSubmit(async (formData) => {
    try {
      await axios.post("api/auth/sign-up", formData);
      setToastMessage({ msg: "Sign up successful!", error: false });
      await waitClearToast();
      router.push("/sign-in");
    } catch (error: any) {
      console.log(error);
      setToastMessage({ msg: error.response.data.error, error: true });
      await waitClearToast;
    }
  });

  return (
    <div className="flex items-center justify-center flex-col space-y-8">
      <Form {...form}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col min-w-[25%] space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            defaultValue=""
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username:</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your username..."
                    {...field}
                    className="bg-[rgb(58,59,60)] border-[rgb(58,59,60)]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            defaultValue=""
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email..."
                    {...field}
                    className="bg-[rgb(58,59,60)] border-[rgb(58,59,60)]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            defaultValue=""
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password:</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password..."
                    {...field}
                    className="bg-[rgb(58,59,60)] border-[rgb(58,59,60)]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-8 w-1/3 ml-auto mr-auto">
            Submit
          </Button>
        </form>
        {toastMessage?.error && toastMessage?.msg?.length > 0 && (
          <Alert variant="destructive" className="w-auto">
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{toastMessage.msg}</AlertDescription>
          </Alert>
        )}
        {!toastMessage.error && toastMessage.msg.length > 0 && (
          <Alert variant="default" className="w-auto">
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>{toastMessage.msg}</AlertDescription>
          </Alert>
        )}
      </Form>
      <p>
        Already have an account?{" "}
        <Link className="underline" href="/sign-in">
          Sign In
        </Link>
      </p>
    </div>
  );
}

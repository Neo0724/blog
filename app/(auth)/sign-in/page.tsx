"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalStorage } from "@uidotdev/usehooks";

import {
  Form,
  FormControl,
  FormDescription,
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
import { SignInSchema } from "@/app/api/sign-in/route";
import Link from "next/link";
import { useRouter } from "next/navigation";


const SignInPage = () => {
  type SignInType = z.infer<typeof SignInSchema>;
  
  const [userId, saveUserId] = useLocalStorage("test-userId", null);
  const router = useRouter();

  const form = useForm<SignInType>({
    resolver: zodResolver(SignInSchema),
  });

  const [error, setError] = useState("");

  const handleSubmit = form.handleSubmit(async (formData) => {
    try {
      const res = await axios.post("api/sign-in", formData);
      saveUserId(res.data.user_id);
      return router.push("/");
    } catch (error) {
      console.log(error);
      setError("An unexpected error occur");
      setTimeout(() => {
        setError("");
      }, 3000);
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email..." {...field} />
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
                <FormLabel>Password:</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password..."
                    {...field}
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
        {error && (
          <Alert variant="destructive" className="w-auto">
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </Form>
      <p>
        Do not have an account?{" "}
        <Link className="underline" href="/sign-up">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default SignInPage;

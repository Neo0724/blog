"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalStorage } from "@uidotdev/usehooks";

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
import { SignInSchema } from "@/app/api/sign-in/route";
import Link from "next/link";
import { useRouter } from "next/navigation";


const SignInPage = () => {
  type SignInType = z.infer<typeof SignInSchema>;
  
  const [_, saveUserId] = useLocalStorage("test-userId", null);
  const router = useRouter();

  const form = useForm<SignInType>({
    resolver: zodResolver(SignInSchema),
  });

  const [toastMessage, setToastMessage] = useState({msg: "", error: false});

  const waitClearToast = new Promise((resolve, reject) => {
      setTimeout(() => {
          setToastMessage({ msg: "", error: false });
          resolve(true);
      }, 5000);
  })

  const handleSubmit = form.handleSubmit(async (formData) => {
      try {
          const res = await axios.post("api/sign-in", formData);
          saveUserId(res.data.user_id);
          setToastMessage({ msg: "Sign in successful!", error: false });
          await waitClearToast;
          router.push("/");
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
            name="email"
            defaultValue=""
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
            defaultValue=""
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
        {toastMessage.error && toastMessage.msg.length > 0 && (
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
        Do not have an account?{" "}
        <Link className="underline" href="/sign-up">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default SignInPage;

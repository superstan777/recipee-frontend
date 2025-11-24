"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "../hooks/useLogin";

const loginSchema = z.object({
  email: z.string().email({ message: "Nieprawidłowy adres email" }),
  password: z.string().min(1, { message: "Hasło jest wymagane" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps extends React.HTMLAttributes<HTMLFormElement> {}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useLogin();

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Zaloguj się</h1>
          <p className="text-muted-foreground text-sm">
            Wprowadź swoje dane, aby zalogować się do konta
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="m@example.com" {...field} />
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="text-left">
              <div className="flex items-center justify-between">
                <FormLabel>Hasło</FormLabel>
                <a
                  href="#"
                  className="text-sm underline-offset-4 hover:underline"
                >
                  Zapomniałeś hasła?
                </a>
              </div>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? "Logowanie..." : "Zaloguj się"}
        </Button>

        {loginMutation.status === "error" && (
          <p className="text-left text-red-500 mt-2">
            {loginMutation.error?.message || "Błąd logowania"}
          </p>
        )}

        <div className="text-center text-sm text-muted-foreground">
          Nie masz konta?{" "}
          <a href="#" className="underline underline-offset-4">
            Zarejestruj się
          </a>
        </div>
      </form>
    </Form>
  );
}

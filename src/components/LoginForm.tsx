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
import { useSignup } from "../hooks/useSignup";

const loginSchema = z.object({
  email: z.email({ message: "Nieprawidłowy adres email" }),
  password: z.string().min(6, { message: "Hasło jest wymagane" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps extends React.HTMLAttributes<HTMLFormElement> {
  signup?: boolean;
  onToggleMode?: () => void;
}

export function LoginForm({
  className,
  signup = false,
  onToggleMode,
  ...props
}: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = signup ? useSignup() : useLogin();

  const onSubmit = (values: LoginFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">
            {signup ? "Zarejestruj się" : "Zaloguj się"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {signup
              ? "Wprowadź swoje dane, aby utworzyć konto"
              : "Wprowadź swoje dane, aby zalogować się do konta"}
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
                {!signup && (
                  <a
                    href="#"
                    className="text-sm underline-offset-4 hover:underline"
                  >
                    Zapomniałeś hasła?
                  </a>
                )}
              </div>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? signup
              ? "Rejestrowanie..."
              : "Logowanie..."
            : signup
            ? "Zarejestruj się"
            : "Zaloguj się"}
        </Button>

        {mutation.status === "error" && (
          <p className="text-left text-red-500 mt-2">{mutation.errorMessage}</p>
        )}

        <div className="text-center text-sm text-muted-foreground">
          {signup ? "Masz już konto?" : "Nie masz konta?"}{" "}
          <Button
            type="button"
            className="underline underline-offset-4 p-0 text-sm text-muted-foreground"
            variant="link"
            onClick={onToggleMode}
          >
            {signup ? "Zaloguj się" : "Zarejestruj się"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

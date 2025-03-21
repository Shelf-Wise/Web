import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignInUserMutation } from "../state/Auth/AuthApiSlice"; // Update this path
import { useNavigate } from "react-router-dom";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [signInUser, { isLoading, isSuccess, data }] = useSignInUserMutation();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
    });
  };

  // Effect to handle successful login and navigation
  useEffect(() => {
    if (isSuccess && data?.isSuccess && data?.value) {
      // Store the token in localStorage
      localStorage.setItem("token", data.value.token);
      localStorage.setItem("userName", data.value.username);
      localStorage.setItem("email", data.value.email);

      // Add a small delay to ensure localStorage is updated before navigation
      setTimeout(() => {
        navigate("/");
      }, 100);
    }
  }, [isSuccess, data, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signInUser(formState);
      // The actual navigation happens in the useEffect above
    } catch (err) {
      console.error("Failed to login:", err);
      setError("Failed to login. Please check your credentials.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your ShelfWise account
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="************"
                  value={formState.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  href="/registration"
                  className="underline underline-offset-4"
                >
                  Sign up
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="https://pub-fba0d713199d491abc5d6dd31e6b7d21.r2.dev/row-bookcases (1).jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

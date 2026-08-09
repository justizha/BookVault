import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const mutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            setAuth(data.user, data.token);
            navigate("/dashboard");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ email, password });
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">
                                        Password
                                    </FieldLabel>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </Field>
                            {mutation.isError && (
                                <p className="text-sm text-destructive">
                                    Invalid credentials
                                </p>
                            )}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? "Logging in..." : "Login"}
                            </Button>
                            <Field>
                                <FieldDescription className="text-center">
                                    Don&apos;t have an account?{" "}
                                    <Link to="/register" className="underline">
                                        Register
                                    </Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

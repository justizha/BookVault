import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const mutation = useMutation({
        mutationFn: register,
        onSuccess: (data) => {
            setAuth(data.user, data.token);
            navigate("/dashboard");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(form);
    };

    return (
        <form
            className={cn("flex flex-col gap-6", className)}
            onSubmit={handleSubmit}
            {...props}
        >
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Create your account</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        Fill in the form below to create your account
                    </p>
                </div>
                <Field>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        required
                        className="bg-background"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        className="bg-background"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />
                    <FieldDescription>
                        We&apos;ll use this to contact you. We will not share
                        your email with anyone else.
                    </FieldDescription>
                </Field>
                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                        id="password"
                        type="password"
                        required
                        className="bg-background"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />
                    <FieldDescription>
                        Must be at least 8 characters long.
                    </FieldDescription>
                </Field>
                <Field>
                    <FieldLabel htmlFor="password_confirmation">
                        Confirm Password
                    </FieldLabel>
                    <Input
                        id="password_confirmation"
                        type="password"
                        required
                        className="bg-background"
                        value={form.password_confirmation}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                password_confirmation: e.target.value,
                            })
                        }
                    />
                    <FieldDescription>
                        Please confirm your password.
                    </FieldDescription>
                </Field>
                {mutation.isError && (
                    <p className="text-sm text-destructive">
                        Registration failed — check your details
                    </p>
                )}
                <Field>
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending
                            ? "Creating account..."
                            : "Create Account"}
                    </Button>
                </Field>
                <FieldDescription className="px-6 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="underline">
                        Login
                    </Link>
                </FieldDescription>
            </FieldGroup>
        </form>
    );
}

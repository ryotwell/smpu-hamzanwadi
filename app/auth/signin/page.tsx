"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { signinAction } from "@/app/actions/auth";
import { SigninSchema, SigninFormState } from "@/lib/validations/auth";

type SigninValues = z.infer<typeof SigninSchema>;

export default function SigninPage() {
    const [showPassword, setShowPassword] = useState(false);

    const [state, formAction, isPending] = useActionState<SigninFormState, FormData>(
        signinAction,
        undefined
    );

    const form = useForm<SigninValues>({
        resolver: zodResolver(SigninSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // Show server-side error messages via sonner toast
    useEffect(() => {
        if (state?.message) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <div className="relative isolate min-h-svh flex items-center justify-center px-4">
            {/* Full background video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover -z-10"
                poster="/assets/hero-preview.jpg"
            >
                <source src="/assets/hero.mp4" type="video/mp4" />
            </video>

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60 dark:bg-black/75 -z-10" />

            {/* Gradient blobs */}
            <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
                <div className="absolute -top-40 -left-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl opacity-60" />
                <div className="absolute -bottom-40 -right-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl opacity-50" />
            </div>

            <div className="w-full max-w-md">
                {/* Back link */}
                <div className="mb-6 flex justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors duration-200"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-4"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        Kembali ke Beranda
                    </Link>
                </div>

                {/* Glass card */}
                <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl p-8 ring-1 ring-white/5">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <img
                            src="/assets/smpuhamzanwadi-panjang.png"
                            alt="SMPU Hamzanwadi"
                            className="w-48 mx-auto mb-6 drop-shadow-lg"
                        />
                        <h1 className="text-2xl font-bold text-white tracking-tight">Portal Admin</h1>
                        <p className="mt-1.5 text-sm text-white/60">
                            Masuk untuk mengelola data sekolah
                        </p>
                    </div>

                    {/* Form */}
                    <Form {...form}>
                        <form
                            id="admin-login-form"
                            action={formAction}
                            className="space-y-5"
                        >
                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/80">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/40">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                                    </svg>
                                                </span>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    autoComplete="email"
                                                    placeholder="admin@sekolah.sch.id"
                                                    className="pl-9 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:border-white/50 focus-visible:ring-white/20"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                        {state?.errors?.email && (
                                            <p className="text-sm text-red-400">{state.errors.email[0]}</p>
                                        )}
                                    </FormItem>
                                )}
                            />

                            {/* Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white/80">
                                            Kata Sandi
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/40">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                                    </svg>
                                                </span>
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    autoComplete="current-password"
                                                    placeholder="Masukkan kata sandi"
                                                    className="pl-9 pr-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:border-white/50 focus-visible:ring-white/20"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    id="toggle-password-visibility"
                                                    onClick={() => setShowPassword((v) => !v)}
                                                    className="absolute inset-y-0 right-3 flex items-center text-white/40 hover:text-white/70 transition-colors"
                                                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                                                >
                                                    {showPassword ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                        {state?.errors?.password && (
                                            <p className="text-sm text-red-400">{state.errors.password[0]}</p>
                                        )}
                                    </FormItem>
                                )}
                            />

                            {/* Forgot password */}
                            {/* <div className="flex justify-end">
                                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                                    Lupa kata sandi?
                                </a>
                            </div> */}

                            {/* Submit */}
                            <Button
                                id="signin-submit-btn"
                                type="submit"
                                disabled={isPending}
                                className="w-full h-11 text-sm font-semibold bg-white text-black hover:bg-white/90 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-black/30"
                            >
                                {isPending ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="size-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Memproses…
                                    </span>
                                ) : (
                                    "Masuk"
                                )}
                            </Button>
                        </form>
                    </Form>

                    {/* Divider */}
                    <div className="mt-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="text-xs text-white/30 uppercase tracking-widest">Admin</span>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>

                    {/* Footer note */}
                    <p className="mt-4 text-center text-xs text-white/30 leading-relaxed">
                        Akses terbatas untuk staf dan admin sekolah.
                        <br />
                        Hubungi IT jika mengalami masalah login.
                    </p>
                </div>

                <p className="mt-6 text-center text-xs text-white/25">
                    © {new Date().getFullYear()} SMPU Hamzanwadi. Hak cipta dilindungi.
                </p>
            </div>
        </div>
    );
}
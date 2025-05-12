"use client";

import { ControlledInput } from "@/components/ControlledInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { userService } from "@/services/userService";
import { messagesEnum } from "@/enums/messagesEnum";
import { zodMessages } from "@/lib/zod/emun";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { AxiosError } from "axios";
import { useState } from "react";
import Link from "next/link";
import { z } from "zod";

import "@/lib/zod/config";

const schema = z
  .object({
    name: z.string().min(1, zodMessages.REQUIRED).min(3), // Ex: Leo
    email: z.string().min(1, zodMessages.REQUIRED).email(),
    password: z.string().min(1, zodMessages.REQUIRED).min(5),
    passwordConfirm: z.string().min(1, zodMessages.REQUIRED).min(5),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "As senhas não coincidem",
    path: ["passwordConfirm"],
  });

type PayloadType = z.infer<typeof schema>;

export default function PageScreen() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PayloadType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const handleSignUp = handleSubmit(async (payload) => {
    try {
      setLoading(true);
      await userService.signUp(payload);
      const response = await signIn("credentials", {
        ...payload,
        redirect: false,
      });
      if (response?.ok) {
        router.push("/kanban");
      } else {
        router.push("/");
      }
    } catch (err) {
      if (err instanceof AxiosError && err.status === 409) {
        toast.info("Conta já cadastrada! O e-mail informado já possui conta.");
      } else {
        toast.error(messagesEnum.FAILED_REQUEST);
      }
    } finally {
      setLoading(false);
    }
  });

  return (
    <form onSubmit={handleSignUp}>
      <div className="bg-neutral-2 min-h-screen">
        <div className="bg-white w-full max-w-2xl mx-auto min-h-screen flex flex-col justify-center px-28 shadow-xl max-sm:px-6">
          <div className="flex items-center justify-center gap-x-2">
            <Icon
              icon="tabler:clock-dollar"
              className="text-5xl max-sm:text-4xl text-primary translate-y-1.5"
            />
            <span className="text-secondary font-bold text-6xl max-sm:text-5xl">
              JusCash
            </span>
          </div>
          <div className="space-y-4 mt-16">
            <ControlledInput
              name="name"
              control={control}
              errors={errors}
              label="Seu nome completo:"
              isRequired
            />
            <ControlledInput
              name="email"
              control={control}
              errors={errors}
              label="E-mail:"
              isRequired
            />
            <ControlledInput
              name="password"
              control={control}
              errors={errors}
              label="Senha:"
              type="password"
              isRequired
            />
            <ControlledInput
              name="passwordConfirm"
              control={control}
              errors={errors}
              label="Confirme sua senha:"
              type="password"
              isRequired
            />
          </div>
          <div className="flex flex-col items-center gap-y-8 mt-14">
            <button
              type="submit"
              className={twMerge(
                "button min-h-9 !w-auto",
                loading && "pointer-events-none"
              )}
            >
              {loading ? (
                <Icon
                  icon="line-md:loading-twotone-loop"
                  className="text-white text-2xl"
                />
              ) : (
                <>Criar conta</>
              )}
            </button>
            <Link
              href="/sign-in"
              className="text-secondary underline font-medium text-lg"
            >
              Já possui uma conta? Fazer o login
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}

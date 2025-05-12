import { Input } from "@/components/Input";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function PageScreen() {
  return (
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
          <Input label="E-mail:" />
          <Input label="Senha:" type="password" />
        </div>
        <div className="flex flex-col items-center gap-y-8 mt-14">
          <button className="button">Login</button>
          <Link
            href="/"
            className="text-secondary underline font-medium text-lg"
          >
            Não possui uma conta? Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}

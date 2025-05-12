import { getSession } from "@/utils/getSession";
import { redirect } from "next/navigation";

export default async function Layout({ children }: React.PropsWithChildren) {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");
  return children;
}

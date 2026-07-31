import { redirect } from "next/navigation";
import RequireUser from "@/lib/RequireUser";
import ClientChatPage from "./ClientChatPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  // Enforce authentication via RequireUser server utility
  const user = await RequireUser();

  if (!user) {
    redirect("/login");
  }

  return <ClientChatPage initialUser={user} />;
}

import { redirect } from "next/navigation";
import RequireUser from "@/lib/RequireUser";
import ClientChatPage from "@/app/ClientChatPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ChatDetailPage({ params }) {
  const user = await RequireUser();

  if (!user) {
    redirect("/login");
  }

  const resolvedParams = await params;
  const { id } = resolvedParams;

  return <ClientChatPage forcedChatId={id} />;
}

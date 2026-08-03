import { redirect } from "next/navigation";
import RequireUser from "@/lib/RequireUser";
import prisma from "@/lib/prisma";
import AppRouteLayoutShell from "./AppRouteLayoutShell";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RouteGroupLayout({ children }) {
  const user = await RequireUser();

  if (!user) {
    redirect("/login");
  }

  let initialChats = [];
  try {
    const chatSessions = await prisma.chatSession.findMany({
      where: { userId: user.id },
      include: {
        sessionCharacters: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    initialChats = JSON.parse(JSON.stringify(chatSessions));
  } catch (err) {
    console.error("Error fetching initial chats for route layout:", err);
  }

  return (
    <AppRouteLayoutShell initialUser={user} initialChats={initialChats}>
      {children}
    </AppRouteLayoutShell>
  );
}

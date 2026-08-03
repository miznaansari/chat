import { redirect } from "next/navigation";
import RequireUser from "@/lib/RequireUser";
import CreateCharacterView from "@/components/CreateCharacterView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CharacterAddPage() {
  const user = await RequireUser();

  if (!user) {
    redirect("/login");
  }

  return <CreateCharacterView user={user} />;
}

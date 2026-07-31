import { redirect } from "next/navigation";
import RequireUser from "@/lib/RequireUser";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  // If user has a valid active session token, redirect to main chat /
  const user = await RequireUser();

  if (user) {
    redirect("/");
  }

  return <LoginForm />;
}

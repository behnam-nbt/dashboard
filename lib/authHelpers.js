import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login"); // اگه لاگین نیست
  }

  if (session.user.role !== "admin") {
    redirect("/"); // اگه لاگین هست ولی admin نیست
  }

  return session;
}

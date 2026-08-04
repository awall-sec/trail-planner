import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";

export default async function ParksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Trail Planner
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-500">{user.email}</span>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm font-medium text-zinc-700 underline dark:text-zinc-300"
            >
              Log out
            </button>
          </form>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          No parks yet
        </h2>
        <p className="mt-2 max-w-md text-sm text-zinc-500">
          This is where you&apos;ll browse supported national parks and start
          planning a trip. Park data is coming in Phase 1.
        </p>
      </main>
    </div>
  );
}

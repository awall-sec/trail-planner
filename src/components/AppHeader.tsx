import Link from "next/link";
import { logout } from "@/app/auth/actions";

export function AppHeader({ userEmail }: { userEmail: string }) {
  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-white/80 px-6 py-4 backdrop-blur-sm dark:bg-zinc-950/70">
      <div className="flex items-center gap-6">
        <Link href="/parks" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Trail Planner
        </Link>
        <Link
          href="/trips"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
        >
          My Trips
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-zinc-600 dark:text-zinc-300">{userEmail}</span>
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
  );
}

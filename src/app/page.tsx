import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-4 text-center dark:bg-black">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Trail Planner
      </h1>
      <p className="mt-3 max-w-md text-lg text-zinc-500">
        Plan backpacking routes, sights, day-by-day itineraries, and permits
        for US National Parks.
      </p>
      <div className="mt-8 flex gap-4">
        {user ? (
          <Link
            href="/parks"
            className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Go to my trips
          </Link>
        ) : (
          <>
            <Link
              href="/signup"
              className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Log in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

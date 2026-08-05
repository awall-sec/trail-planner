import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getParks } from "@/lib/data/parks";
import { AppHeader } from "@/components/AppHeader";

export default async function ParksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const parks = await getParks();

  return (
    <div
      className="flex flex-1 flex-col bg-zinc-900 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/mountains-parks-day.svg')" }}
    >
      <AppHeader userEmail={user.email ?? ""} />

      <main className="flex flex-1 flex-col px-6 py-10">
        <div className="mx-auto w-full max-w-5xl">
          <h2 className="mb-6 text-2xl font-semibold text-white drop-shadow">
            Parks
          </h2>

          {parks.length === 0 ? (
            <div className="rounded-xl bg-white/90 px-8 py-6 text-center shadow-xl backdrop-blur-sm dark:bg-zinc-950/85">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                No parks yet
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Park data is coming soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {parks.map((park) => (
                <Link
                  key={park.id}
                  href={`/parks/${park.nps_park_code}`}
                  className="group overflow-hidden rounded-xl bg-white/95 shadow-xl backdrop-blur-sm transition hover:shadow-2xl dark:bg-zinc-950/90"
                >
                  {park.hero_photo_url && (
                    <div className="relative h-40 w-full">
                      <Image
                        src={park.hero_photo_url}
                        alt={park.name}
                        fill
                        className="object-cover transition group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {park.name}
                    </h3>
                    {park.state && (
                      <p className="text-sm text-zinc-500">{park.state}</p>
                    )}
                    {park.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {park.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

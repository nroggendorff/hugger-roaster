import { redirect } from "next/navigation";
import Image from "next/image";

import { getRoast } from "@/app/actions/roast";
import { Quote } from "@/components/quote";
import Logo from "@/assets/logo.svg";
import Link from "next/link";

async function get(id: string) {
  const roast = await getRoast({ id });
  return roast;
}

export default async function Roast({
  params: { roastId },
}: {
  params: { roastId: string };
}) {
  const quote = await get(roastId);

  if (!quote?.data) {
    redirect("/");
  }
  return (
    <div>
      <header className="flex items-start max-lg:gap-1 lg:items-center justify-between max-lg:flex-col border-b border-zinc-200 pb-5">
        <Image
          src={Logo}
          alt="logo hugging face"
          width={100}
          height={100}
          className="object-contain w-36 lg:w-44"
        />
        <div>
          <p className="text-sm text-zinc-500">
            Roast your favorite Hugging Face user! 👹
          </p>
        </div>
      </header>
      <Quote data={quote.data?.text}>
        <Link
          href="/"
          className="bg-black rounded-full inline-block px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 mt-5"
        >
          Roast another user! 🧨
        </Link>
      </Quote>
    </div>
  );
}

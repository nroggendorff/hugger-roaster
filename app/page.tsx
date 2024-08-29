"use client";
import { useState } from "react";
import Image from "next/image";
import classNames from "classnames";

import { roast } from "@/app/actions/roast";
import { Form, FormProps } from "@/components/form";

import Logo from "@/assets/logo.svg";

export default function Home() {
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoast = async (form: FormProps) => {
    setError("");
    setData("");
    setLoading(true);

    const res: {
      error?: string;
      data?: any;
    } = await roast(form);

    if (res.error) {
      setError(res.error);
    } else {
      setData(res?.data);
    }

    setLoading(false);
  };

  return (
    <section className="min-h-screen h-full w-full flex items-center justify-center flex-col bg-zinc-100 gap-5 overflow-auto p-6">
      <div className="max-w-2xl w-full border border-gray-200 bg-white rounded-3xl p-8 grid gap-8 shadow-xl shadow-black/5">
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
        {error && (
          <div className="text-sm text-red-600 bg-red-500/10 border-[1px] border-red-500/15 px-3.5 py-2.5 rounded-xl">
            <p className="font-semibold text-sm">Oops!</p>
            {error}
          </div>
        )}
        <Form loading={loading} onSubmit={handleRoast} />
      </div>
      {data && (
        <div className="max-w-2xl w-full border border-gray-200 bg-white rounded-3xl p-8 shadow-xl shadow-black/5 relative z-[1] overflow-hidden">
          <p className="text-[8rem] absolute bottom-0 translate-y-1/3 right-0 opacity-20 -z-[1]">
            🧨
          </p>
          <p className="uppercase text-base tracking-wider font-semibold mb-2">
            Roasting
          </p>
          <div className="text-lg text-gray-500 leading-relaxed container mx-auto text-pretty whitespace-break-spaces">
            {data}
          </div>
          <button
            className={classNames(
              "bg-black rounded-full mt-4 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed",
              {
                // "animate-pulse": loading,
              }
            )}
            disabled={true}
          >
            Share (coming soon)
          </button>
        </div>
      )}
    </section>
  );
}

"use client";
import { useState } from "react";
import Image from "next/image";
import classNames from "classnames";

import { roast } from "@/app/actions/roast";
import { share, ShareProps } from "@/app/actions/share";
import { Form, FormProps } from "@/components/form";
import { CopyToClipboard } from "@/components/copy";
import { Quote } from "@/components/quote";

import Logo from "@/assets/logo.svg";

export default function Home() {
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingShare, setLoadingShare] = useState(false);
  const [hfUser, setHfUser] = useState<string | undefined>(undefined);
  const [quote, setQuote] = useState<string | undefined>(undefined);

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
      setQuote(undefined);
      setHfUser(form.username);
      setData(res?.data);
    }

    setLoading(false);
  };

  const handleShare = async (form: ShareProps) => {
    setLoadingShare(true);
    const res = await share({ hf_user: form.hf_user, text: form.text });
    if (res?.data) {
      setQuote(res.data.id);
    }
    setLoadingShare(false);
  };

  return (
    <>
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
        <Quote data={data}>
          {quote ? (
            <CopyToClipboard id={quote} />
          ) : (
            <button
              className={classNames(
                "bg-black rounded-full mt-4 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed",
                {
                  "animate-pulse": loadingShare,
                }
              )}
              disabled={loadingShare}
              onClick={() =>
                hfUser && handleShare({ hf_user: hfUser, text: data })
              }
            >
              {loadingShare ? "Creating a quote..." : "Share my roast!"}
            </button>
          )}
        </Quote>
      )}
    </>
  );
}

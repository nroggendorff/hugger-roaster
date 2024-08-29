"use client";

import { useState } from "react";
import classNames from "classnames";

import { Input } from "./input";
import { Select } from "./select";

interface Props {
  loading: boolean;
  onSubmit: (form: FormProps) => void;
}

export interface FormProps {
  username?: string;
  language: Language;
}
export type Language = "en" | "fr" | "es";

export const Form: React.FC<Props> = ({ loading, onSubmit }) => {
  const [form, setForm] = useState<FormProps>({
    username: undefined,
    language: "en",
  });

  return (
    <main className="grid grid-cols-1 gap-6">
      <div>
        <p className="font-semibold text-xs uppercase mb-2 text-zinc-600">
          Hugging Face username
        </p>
        <Input
          value={form.username}
          onChange={(value) => setForm({ ...form, username: value })}
        />
      </div>
      <div>
        <p className="font-semibold text-xs uppercase mb-2 text-zinc-600">
          Language
        </p>
        <Select
          value={form.language}
          onChange={(value) => setForm({ ...form, language: value })}
        />
      </div>
      <div className="flex justify-end">
        <button
          className={classNames(
            "bg-black max-lg:w-full rounded-full px-5 py-2.5 text-base font-medium text-white hover:bg-zinc-800 disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed",
            {
              "animate-pulse": loading,
            }
          )}
          disabled={!form.username || loading}
          onClick={() => onSubmit(form)}
        >
          {loading ? "Roasting in progress..." : "Roast this Hugger 🔥"}
        </button>
      </div>
    </main>
  );
};

import { useState } from "react";
import classNames from "classnames";
import { CircleCheck, OctagonX } from "lucide-react";

import { check_user } from "@/app/actions/check_user";
import { on } from "events";

interface Props {
  value?: string;
  onChange: (s?: string) => void;
}
export const Input: React.FC<Props> = ({ onChange, value }) => {
  const [error, setError] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean>(false);

  const [username, setUsername] = useState<string>("");

  const handleCheckUser = async (username: string) => {
    const user = await check_user(username);
    if (!user) {
      setError(true);
      setValid(false);
      onChange(undefined);
    } else {
      setError(false);
      setValid(true);
      onChange(username);
    }
  };

  return (
    <div
      className={classNames(
        "rounded-md mr-2 border border-gray-200 relative ring-transparent text-zinc-600 focus-within:ring-amber-500/20 ring-[3px] flex items-center justify-center overflow-hidden",
        {
          "!border-emerald-500/50 focus-within:!ring-emerald-500/20 !text-emerald-500 ring-emerald-500/20":
            valid,
          "!border-red-500/50 focus-within:!ring-red-500/20 !text-red-500":
            error,
        }
      )}
    >
      <div className="bg-zinc-100 border-r border-zinc-200 text-zinc-500 text-sm px-3 h-[40px] flex items-center justify-center">
        <span className="max-lg:hidden">https://</span>huggingface.co/
      </div>
      <input
        value={username}
        onChange={(e) => {
          onChange("");
          setUsername(e.target.value);
        }}
        onBlur={(e) => handleCheckUser(e.target.value)}
        placeholder="enzostvs"
        className="outline-none bg-transparent border-none w-full text-sm px-3 py-2.5 flex-1"
      />
      {error && <OctagonX className="text-red-500 w-5 h-5 absolute right-3" />}
      {valid && (
        <CircleCheck className="text-emerald-500 w-5 h-5 absolute right-3" />
      )}
    </div>
  );
};

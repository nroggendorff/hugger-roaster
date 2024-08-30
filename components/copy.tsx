import classNames from "classnames";
import { CopyIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useCopyToClipboard, useUpdateEffect } from "react-use";

export const CopyToClipboard = ({ id }: { id: string }) => {
  const [state, copyToClipboard] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const url = useMemo(() => {
    return `https://huggingface.co/spaces/enzostvs/hugger-roaster/${id}`;
  }, [id]);

  const handleCopy = () => {
    setCopied(true);
    copyToClipboard(url);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="w-full mt-5">
      <p className="text-xs text-zinc-500">
        Share this link with your friends so they can see your roast and try it
        out themselves!
      </p>
      <div
        className="bg-white mt-2 max-w-max rounded-md mr-2 border border-gray-200 text-sm px-3 py-2.5 relative ring-transparent text-zinc-600 hover:ring-blue-500/20 ring-[3px] flex items-center justify-center group"
        onClick={handleCopy}
      >
        <div
          className={classNames(
            "bg-black/80 text-xs text-white px-2 py-1 rounded-md absolute left-0 top-0 -translate-y-1/2 transition-all duration-200",
            {
              "opacity-0 !translate-y-0": !copied,
            }
          )}
        >
          Copied!
        </div>
        <CopyIcon className="w-4 h-4 text-zinc-400 mr-2 group-hover:text-blue-500" />
        <p className="flex-1">{url}</p>
      </div>
    </div>
  );
};

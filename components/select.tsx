import { Language } from "./form";

interface Props {
  value: string;
  onChange: (s: Language) => void;
}
export const Select: React.FC<Props> = ({ onChange, value }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Language)}
      className="rounded-md mr-2 border border-gray-200 relative ring-transparent text-zinc-600 focus-within:ring-amber-500/20 ring-[3px] flex items-center justify-center overflow-hidden text-sm px-3 py-2.5 max-w-[150px] w-full outline-none"
    >
      <option value="en">English</option>
      <option value="fr">French</option>
      <option value="es">Spanish</option>
    </select>
  );
};

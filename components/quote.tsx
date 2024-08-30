export const Quote = ({
  data,
  children,
}: {
  data: string;
  children?: React.ReactNode;
}) => {
  return (
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
      {children}
    </div>
  );
};

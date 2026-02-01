const AuthInput = ({
  id,
  label,
  placeholder,
  value,
  inputType = "text",
  setData,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  inputType?: string;
  setData: (arg: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-secondary-1">
        {label}
      </label>
      <input
        id={id}
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setData(e.target.value)}
        className="
          w-full rounded-md
          border border-gray-300
          px-3 py-2.5
          text-sm
          placeholder:text-gray-400
          focus:border-secondary-1
          focus:ring-2 focus:ring-secondary-2
          outline-none
        "
      />
    </div>
  );
};

export default AuthInput;

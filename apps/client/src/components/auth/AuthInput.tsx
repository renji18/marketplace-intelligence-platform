const AuthInput = ({
  id,
  label,
  placeholder,
  value,
  inputType,
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
    <div>
      <label className="text-gray" htmlFor={id}>
        {label}
      </label>
      <input
        type={inputType ?? "text"}
        id={id}
        placeholder={placeholder}
        value={value}
        className="w-full border mt-1 p-3 placeholder:text-gray-300 rounded-md border-gray-300 outline-gray-600 text-sm"
        onChange={(e) => setData(e.target.value)}
      />
    </div>
  );
};

export default AuthInput;

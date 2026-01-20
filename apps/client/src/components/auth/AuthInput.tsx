const AuthInput = ({
  id,
  label,
  placeholder,
  value,
  setData,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  setData: (arg: string) => void;
}) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        type="text"
        id={id}
        placeholder={placeholder}
        value={value}
        className="w-full border"
        onChange={(e) => setData(e.target.value)}
      />
    </div>
  );
};

export default AuthInput;

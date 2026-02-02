const FormInput = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number";
  placeholder?: string;
}) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-secondary-1">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full px-3 py-2
          border rounded-md
          text-sm
          focus:ring-2 focus:ring-secondary-2
          outline-none
        "
      />
    </div>
  );
};

export default FormInput;

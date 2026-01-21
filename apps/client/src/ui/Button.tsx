const Button = ({
  text,
  variant,
  customCss,
  fn,
  disabled,
}: {
  text: string;
  variant: "primary-light" | "primary-dark" | "secondary" | "accent" | "custom";
  customCss?: string;
  fn?: () => void;
  disabled: boolean;
}) => {
  const baseCss = `transition-all duration-200 ease-in-out rounded-[200px] ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`;

  const primaryLight = `bg-primary-1 text-white py-[11.5px] px-[50.5px] font-bold ${baseCss} ${customCss}`;

  const primaryDark = `bg-secondary-1 text-white py-[14.5px] px-[38.5px] font-bold ${baseCss} ${customCss}`;

  const secondary = `bg-accent text-secondary-1 py-[11.5px] px-[53.5px] font-bold ${baseCss} ${customCss}`;

  const accent = `bg-white border border-black text-black py-[11.5px] px-[61.5px] ${baseCss} ${customCss}`;

  return (
    <button
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          fn?.();
        }
      }}
      className={
        variant === "primary-light"
          ? primaryLight
          : variant === "primary-dark"
            ? primaryDark
            : variant === "secondary"
              ? secondary
              : variant === "accent"
                ? accent
                : customCss
      }
    >
      <p>{text}</p>
    </button>
  );
};

export default Button;

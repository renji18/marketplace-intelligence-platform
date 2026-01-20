const Button = ({
  text,
  variant,
  customCss,
  fn,
}: {
  text: string;
  variant: "primary-light" | "primary-dark" | "secondary" | "accent" | "custom";
  customCss?: string;
  fn?: () => void;
}) => {
  const primaryLight = `bg-primary-1 text-white py-[11.5px] px-[50.5px] rounded-[200px] font-bold ${customCss}`;

  const primaryDark = `bg-secondary-1 text-white py-[14.5px] px-[38.5px] rounded-[200px] font-bold ${customCss}`;

  const secondary = `bg-accent text-secondary-1 py-[11.5px] px-[53.5px] rounded-[200px] font-bold ${customCss}`;

  const accent = `bg-white border border-black text-black py-[11.5px] px-[61.5px] rounded-[200px] ${customCss}`;

  return (
    <div
      onClick={() => fn?.()}
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
    </div>
  );
};

export default Button;

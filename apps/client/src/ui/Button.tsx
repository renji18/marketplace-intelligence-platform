type ButtonVariant = "primary" | "primary-dark" | "secondary" | "accent";

type ButtonSize = "sm" | "md" | "lg";

const Button = ({
  text,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
}: {
  text: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variants: Record<ButtonVariant, string> = {
    primary: `
      bg-primary-1 text-white
      hover:bg-secondary-1
      focus:ring-secondary-2
    `,
    "primary-dark": `
      bg-secondary-1 text-white
      hover:bg-primary-1
      focus:ring-secondary-2
    `,
    secondary: `
      bg-accent text-secondary-1
      hover:bg-secondary-2
      focus:ring-secondary-2
    `,
    accent: `
      bg-white border border-gray-300 text-secondary-1
      hover:bg-accent
      focus:ring-secondary-2
    `,
  };

  const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`
        ${base}
        ${sizes[size]}
        ${variants[variant]}
        ${disabled ? disabledStyles : ""}
        ${className}
      `}
    >
      {text}
    </button>
  );
};

export default Button;

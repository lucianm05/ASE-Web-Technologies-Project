import { Component } from "@/types";

const themes = {
  none: "",
  default: "bg-white",
  danger: "bg-red-500 text-white",
} as const;
interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  theme?: keyof typeof themes;
}

const Button: Component<Props> = ({
  children,
  type = "button",
  theme = "default",
  ...props
}) => {
  return (
    <button
      {...props}
      type={type}
      className={`w-max ${theme !== "none" ? "px-4 py-1 border rounded" : ""} ${
        themes[theme]
      } ${props.className}`}
    >
      {children}
    </button>
  );
};

export default Button;

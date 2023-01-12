import { Component } from "@/types";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

const Button: Component<Props> = ({ children, type = "button", ...props }) => {
  return (
    <button
      type={type}
      className={`w-max px-4 py-1 border rounded bg-white ${props.className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

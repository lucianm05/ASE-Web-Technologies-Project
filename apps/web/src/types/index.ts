export type VoidFn<T = unknown> = (value: T) => void;

export interface Component<T = {}>
  extends React.FC<React.PropsWithChildren<T>> {}

export interface Alert {
  id: number;
  message: string;
  type: "success" | "error";
}

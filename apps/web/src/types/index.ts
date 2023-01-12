export type VoidFn<T = unknown> = (value: T) => void;

export interface Component<T = {}>
  extends React.FC<React.PropsWithChildren<T>> {}

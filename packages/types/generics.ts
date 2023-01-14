import { BaseEntity } from ".";

export type Payload<T extends BaseEntity> = Omit<
  T,
  "id" | "createdAt" | "updatedAt"
>;

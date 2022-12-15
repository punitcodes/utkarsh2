export type TForm<T> = Omit<T, "id" | "createdAt" | "updatedAt">;

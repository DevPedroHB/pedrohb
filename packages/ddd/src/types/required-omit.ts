export type RequiredOmit<T, K extends keyof T> = Required<Omit<T, K>>;

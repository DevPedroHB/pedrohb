export type Flatten<T> = {
	[P in keyof T]: T[P];
};

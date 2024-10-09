export const themes = ["light", "dark", "system"] as const;

export type Themes = (typeof themes)[number];

import packageJson from "../../package.json";

export function formatKeyStorage(key: string) {
	return `@${packageJson.name}:${packageJson.version}:${key}`;
}

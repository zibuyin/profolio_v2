import fs from "fs";

export default function indexFolder(path: string) {
	return fs.readdirSync(path);
}

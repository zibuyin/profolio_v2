import { execFile } from "child_process";
import fs from "fs/promises";
import path from "path";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

interface RunPostPublishOptions {
	filePath: string;
	postType: "blog" | "project";
	slug: string;
}

export async function runPostPublish({
	filePath,
	postType,
	slug,
}: RunPostPublishOptions) {
	const scriptPath = path.resolve(process.cwd(), "updatePosts.sh");
	await fs.access(scriptPath);

	return execFileAsync("bash", [scriptPath, filePath, postType, slug], {
		cwd: process.cwd(),
		timeout: 15 * 60 * 1000,
		maxBuffer: 1024 * 1024,
	});
}
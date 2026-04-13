import matter from "gray-matter";
import fs from "fs";
import path from "path";

export default function loadMd(path: string) {
	console.log(path);
	const mdPath = path;
	const mdContent = fs.readFileSync(mdPath);
	const { content, data } = matter(mdContent);
	return { data, content };
}

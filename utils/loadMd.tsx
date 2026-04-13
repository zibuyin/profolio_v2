import matter from "gray-matter";
import fs from "fs";

export default function loadMd(path: string) {
	const mdPath = path;
	const mdContent = fs.readFileSync(mdPath);
	const { content, data } = matter(mdContent);
	return { data, content };
}

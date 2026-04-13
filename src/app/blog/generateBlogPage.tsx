import matter from "gray-matter";
import fs from "fs";
import path from "path";

const mdPath = path.join(process.cwd(), "content/blog/md/testBlogPage.md");
const mdContent = fs.readFileSync(mdPath);

export default function BlogPage() {
	return <h1>{mdContent}</h1>;
}

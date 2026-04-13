import ProjectPage from "@/src/app/ui/projectPage";
import blogPage from "../generateBlogPage";
import BlogPage from "../generateBlogPage";

import matter from "gray-matter";
import fs from "fs";
import path from "path";

function loadFile(slug: string) {
	const mdPath = path.join(process.cwd(), `content/blog/md/${slug}.mdx`);
	const mdContent = fs.readFileSync(mdPath);
	const { content, data } = matter(mdContent);
	return { data, content };
}

export default async function Page(props: {
	params: Promise<{ slug: string }>;
}) {
	const params = await props.params;
	const { data, content } = loadFile(params.slug);
	console.log(params.slug);
	return (
		<main>
			{/* <ProjectPage
				title="Automatic Medication Dispenser"
				date="March 29, 2026"
				author="Nathan Yin"
				mdPath="automaticMedicationDispenser.md"
			/> */}
			<h1>{data.title}</h1>
			<h1>{content}</h1>
		</main>
	);
}

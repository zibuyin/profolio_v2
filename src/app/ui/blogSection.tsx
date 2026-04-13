import BlogCard from "../components/blogCard";
import indexFolder from "@/utils/indexFolder";
import loadMd from "@/utils/loadMd";

export default function BlogSection() {
	const cards = [];
	const mds = indexFolder("content/blog/md");
	const totalNumber = mds.length;
	for (let i = 0; i < mds.length; i++) {
		const { data, content } = loadMd(`content/blog/md/${mds[i]}`);

		const wordCount = content.trim().split(/\s+/).length;
		// Ceil to prevent 0 min
		// 238wpm is avg for human
		const readTime = Math.ceil(wordCount / 238);

		const fallbackSlug = mds[i].replace(/\.mdx?$/, "");

		cards.push(
			<BlogCard
				key={data.slug ?? fallbackSlug}
				title={data.title}
				subtitle={data.subtitle}
				date={data.date}
				slug={data.slug ?? fallbackSlug}
				readTime={`${readTime}min`}
			/>,
		);
	}

	return (
		<div className="blog-section flex flex-col">
			<h1 className="text-4xl md:text-5xl font-bold mb-5 md:mb-5">
				Blog
			</h1>
			<p className="text-l md:text-xl font-bold mb-2">
				{totalNumber} posts since April 12, 2026
			</p>
			<div>{cards}</div>
		</div>
	);
}
// "use client";

import ProjectCard from "../components/projectCard";

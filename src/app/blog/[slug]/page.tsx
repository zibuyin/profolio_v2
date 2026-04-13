import { compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Comments from "@/src/app/components/giscus";
import Model from "@/src/app/ui/modelRenderers/renderModel";
import fs from "fs";
import path from "path";

function loadFile(slug: string) {
	const mdPath = path.join(process.cwd(), `content/blog/md/${slug}.mdx`);
	return fs.readFileSync(mdPath, "utf8");
}

export default async function Page(props: {
	params: Promise<{ slug: string }>;
}) {
	const params = await props.params;
	const source = loadFile(params.slug);
	const { frontmatter, content } = await compileMDX<{
		title: string;
		date: string;
		author?: string;
	}>({
		source,
		options: { parseFrontmatter: true },
		components: {
			Model,
			h1: (props) => (
				<h1 className="text-5xl font-bold mb-4" {...props} />
			),
			h2: (props) => (
				<h2 className="text-2xl font-semibold mb-3" {...props} />
			),
			h3: (props) => (
				<h3
					className="text-xl font-semibold text-gray-700 mb-2"
					{...props}
				/>
			),
			p: (props) => <p className="mb-4 leading-relaxed" {...props} />,
			ul: (props) => <ul className="list-disc ml-8 mb-4" {...props} />,
			ol: (props) => <ol className="list-decimal ml-8 mb-4" {...props} />,
			li: (props) => <li className="mb-1" {...props} />,
			a: (props) => (
				<a
					className="text-blue-600 underline hover:text-blue-800"
					{...props}
				/>
			),
			code: (props) => (
				<code
					className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono"
					{...props}
				/>
			),
			pre: (props) => (
				<pre
					className="bg-gray-900 text-white p-4 rounded mb-4 overflow-x-auto"
					{...props}
				/>
			),
			blockquote: (props) => (
				<blockquote
					className="border-l-4 border-gray-400 pl-4 italic text-gray-600 bg-gray-50 my-4 py-2"
					{...props}
				/>
			),
			img: ({ alt, ...props }) => (
				<img
					alt={alt ?? ""}
					className="max-w-full rounded-2xl my-4 w-[95%] mx-auto"
					{...props}
				/>
			),
			hr: (props) => (
				<hr className="border-t border-gray-300 my-8" {...props} />
			),
		},
	});

	return (
		<div className="pl-[30px] pr-[30px] xl:pl-[25vw] xl:pr-[25vw]">
			<div className="back-btn mt-10 w-fit h-fit">
				<Link
					href="/#blog"
					className="inline-flex items-center justify-center shrink-0"
				>
					<FontAwesomeIcon
						icon={faCircleArrowLeft}
						className="w-6 h-6 hover:text-gray-400 transition-colors duration-200 cursor-pointer"
						size="xl"
					/>
				</Link>
			</div>

			<div className="pt-[100px]">
				<h1 className="title text-3xl xl:text-5xl font-bold mb-1.5">
					{frontmatter.title}
				</h1>
				<h2 className="date xl:text-xl font-bold">
					{frontmatter.date}
					{frontmatter.author ? ` • ${frontmatter.author}` : ""}
				</h2>
				<div className="bg-gray-500 w-full h-[1px] mt-3 mb-5"></div>
				{content}
				<div className="bg-gray-500 w-full h-[1px] mt-10 mb-5"></div>
				<Comments />
			</div>
		</div>
	);
}

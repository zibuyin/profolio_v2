import { compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Comments from "@/src/app/components/giscus";
import Model from "@/src/app/ui/modelRenderers/renderModel";
import CodeBlock from "@/src/app/components/CodeBlock";
import { makeHeading } from "@/src/app/components/HeadingWithAnchor";
import { remarkAdmonitions } from "@/src/lib/remarkAdmonitions";
import fs from "fs";
import path from "path";
import type { Metadata, ResolvingMetadata } from "next";
import remarkDirective from "remark-directive";
import loadMd from "@/utils/loadMd";
type generateMetadataProps = {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function loadFile(slug: string) {
	if (!/^[a-zA-Z0-9-]+$/.test(slug)) {
		notFound();
	}

	const contentDir = path.resolve(process.cwd(), "content/blog/md");
	const mdPath = path.resolve(contentDir, `${slug}.mdx`);

	if (
		!mdPath.startsWith(`${contentDir}${path.sep}`) ||
		!fs.existsSync(mdPath)
	) {
		notFound();
	}

	return fs.readFileSync(mdPath, "utf8");
}

export async function generateMetadata(
	{ params, searchParams }: generateMetadataProps,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const slug = (await params).slug;
	const { data, content } = loadMd(`content/blog/md/${slug}.mdx`);

	return {
		title: `Nathan Yin - ${data.title}`,
		description: data.description,
	};
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
		options: {
			parseFrontmatter: true,
			mdxOptions: {
				remarkPlugins: [remarkDirective, remarkAdmonitions],
			},
		},
		components: {
			Model,
			code: (props) => <CodeBlock {...props} />,
			h1: makeHeading("h1"),
			h2: makeHeading("h2"),
			h3: makeHeading("h3"),
			h4: makeHeading("h4"),
			h5: makeHeading("h5"),
			h6: makeHeading("h6"),
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
				<div className="post-content">{content}</div>
				<div className="bg-gray-500 w-full h-[1px] mt-10 mb-5"></div>
				<Comments />
			</div>
		</div>
	);
}

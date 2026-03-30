"use client";

// Renderer for each projects page, responsible for md -> html and margins & paddings
import Markdown from "react-markdown";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

interface ProjectPageProps {
	title: string;
	date: string;
	author: string;
	mdPath: string;
}

export default function ProjectPage({
	title,
	date,
	author,
	mdPath,
}: ProjectPageProps) {
	const [content, setContent] = useState<string>("");
	const [isMounted, setIsMounted] = useState(false);
	const router = useRouter();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Fetch md
	useEffect(() => {
		fetch(`/projects/md/${mdPath}`)
			.then((res) => res.text())
			.then((text) => setContent(text));
	}, []);

	return (
		<div className="pl-[27vw] pr-[27vw] h-scree">
			<div className="back-btn mt-10  w-fit h-fit:">
				{isMounted && (
					<FontAwesomeIcon
						icon={faCircleArrowLeft}
						size="xl"
						className=" hover:text-gray-400 transition-colors duration-200 cursor-pointer"
						onClick={() => router.push("/")}
					/>
				)}
			</div>

			<div className=" pt-[130px]">
				<h1 className="title text-5xl font-bold mb-1.5">{title}</h1>
				<h2 className="date text-xl font-bold">
					{date} • {author}
				</h2>
				<div className="bg-gray-500 w-full h-[1px] mt-3 mb-5"></div>
				<Markdown
					components={{
						h1: (props) => (
							<h1
								className="text-5xl font-bold  mb-4"
								{...props}
							/>
						),
						h2: (props) => (
							<h2
								className="text-2xl font-semibold  mb-3"
								{...props}
							/>
						),
						h3: (props) => (
							<h3
								className="text-xl font-semibold text-gray-700 mb-2"
								{...props}
							/>
						),
						p: (props) => (
							<p className="mb-4 leading-relaxed" {...props} />
						),
						ul: (props) => (
							<ul className="list-disc ml-8 mb-4" {...props} />
						),
						ol: (props) => (
							<ol className="list-decimal ml-8 mb-4" {...props} />
						),
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
						img: (props) => (
							<img
								className="max-w-full rounded-2xl my-4 w-[90%] mx-auto"
								{...props}
							/>
						),
						hr: (props) => (
							<hr
								className="border-t border-gray-300 my-8"
								{...props}
							/>
						),
					}}
				>
					{content}
				</Markdown>
			</div>
		</div>
	);
}

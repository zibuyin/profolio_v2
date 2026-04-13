// "use client";

import ProjectCard from "../components/projectCard";
import { useTranslations } from "next-intl";
import indexFolder from "@/utils/indexFolder";
import loadMd from "@/utils/loadMd";

export default function Projects() {
	const section_t = useTranslations("ProjectsSection");
	const cards = [];
	const mds = indexFolder("content/project/md");

	for (let i = 0; i < mds.length; i++) {
		const { data } = loadMd(`content/project/md/${mds[i]}`);
		const fallbackSlug = mds[i].replace(/\.mdx?$/, "");

		cards.push(
			<ProjectCard
				key={data.slug ?? fallbackSlug}
				title={data.title}
				description={data.description}
				slug={data.slug ?? fallbackSlug}
				// Give nothing if not present
				modelPath={data.modelPath ?? ""}
				imagePath={data.imagePath ?? ""}
				repoUrl={data.repoUrl ?? ""}
			/>,
		);
	}

	return (
		<div className="projects-section flex flex-col text-center md:text-left">
			<h1 className="text-5xl md:text-6xl font-bold mb-10">
				{section_t("title")}
			</h1>
			{cards}
		</div>
	);
}

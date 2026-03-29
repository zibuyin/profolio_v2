"use client";

import ProjectCard from "./projectCard";
import { useTranslations } from "next-intl";

export default function Projects() {
	const t = useTranslations("ProjectCards");
	const section_t = useTranslations("ProjectsSection");
	return (
		<div className="projects-section flex flex-col">
			<h1 className="text-6xl font-bold mb-6">{section_t("title")}</h1>
			<ProjectCard
				title={t("title_1")}
				modelPath="models/medicationDispenser.gltf"
				description={t("description_1")}
				url="/pages/automaticMedicationDispenser"
			/>
		</div>
	);
}

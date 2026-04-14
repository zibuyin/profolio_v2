// "use client";

import ProjectCard from "../components/projectCard";
import { useTranslations } from "next-intl";
import indexFolder from "@/utils/indexFolder";
import loadMd from "@/utils/loadMd";

export default function Contacts() {
	return (
		<div className="projects-section flex flex-col text-center md:text-left">
			<h1 className="text-4xl md:text-5xl font-bold mb-10">Contacts</h1>
		</div>
	);
}

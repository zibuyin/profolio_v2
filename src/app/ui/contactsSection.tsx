// "use client";

import ProjectCard from "../components/projectCard";
import { useTranslations } from "next-intl";
import indexFolder from "@/utils/indexFolder";
import loadMd from "@/utils/loadMd";
import Comments from "../components/giscus";

export default function Contacts() {
	return (
		<div className="projects-section flex flex-col text-center md:text-left">
			<h1 className="text-4xl md:text-5xl font-bold mb-3">Contacts</h1>
			<p className="text-l md:text-xl font-bold mb-2">
				I suggest leaving a comment! It will be forward to my email
				automatically!
			</p>
			<Comments />
		</div>
	);
}

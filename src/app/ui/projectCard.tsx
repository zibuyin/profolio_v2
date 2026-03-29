import { use } from "react";
import Model from "./modelRenderers/renderModel";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface ProjectCardProps {
	title: string;
	description: string;
	url: string;
	modelPath?: string;
	imagePath?: string;
}

export default function ProjectCard({
	title,
	description,
	url,
	modelPath,
	imagePath,
}: ProjectCardProps) {
	const router = useRouter();
	const t = useTranslations("ProjectsSection");
	return (
		<div>
			<div className="flex flex-col xl:flex-row justify-between">
				<div className="text-section">
					<h2 className="text-3xl font-semibold">{title}</h2>
					<p className="mt-2 mr-35">{description}</p>
					<button
						className="bg-blue-700 hover:bg-blue-600 p-1 pr-1.5 pl-1.5 mt-3 rounded-full font-medium text-white"
						onClick={() => router.push(url)}
					>
						{t("btn_label")}
					</button>
				</div>
				{modelPath ? (
					<Model path={modelPath}></Model>
				) : imagePath ? (
					<img
						src={imagePath}
						alt={title}
						className="ml-40 w-auto h-70"
					/>
				) : (
					<p className="text-gray-500">No preview available</p>
				)}
			</div>
		</div>
	);
}

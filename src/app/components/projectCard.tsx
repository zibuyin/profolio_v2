import Link from "next/link";
import Model from "../ui/modelRenderers/renderModel";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
interface ProjectCardProps {
	title: string;
	description: string;
	slug: string;
	modelPath?: string;
	imagePath?: string;
	repoUrl?: string;
}

export default function ProjectCard({
	title,
	description,
	slug,
	modelPath,
	imagePath,
	repoUrl,
}: ProjectCardProps) {
	const t = useTranslations("ProjectsSection");
	const parsedUrl = `project/${slug}`;
	return (
		<div>
			<div className="flex flex-col xl:flex-row justify-between">
				<div className="text-section text-center md:text-left">
					<h2 className="text-2xl md:text-3xl font-semibold">
						{title}
					</h2>
					<p className="mt-2 xl:mr-35">{description}</p>
					<Link
						href={parsedUrl}
						className="inline-block bg-blue-700 hover:bg-blue-600 p-2 pr-3 pl-3 mt-6 rounded-full font-medium text-white"
					>
						{t("btn_label")}
					</Link>
					{/* Only renders the github clickable if a URL to the repo is provided */}
					{repoUrl && (
						<a
							className="ml-5"
							href={repoUrl}
							target="_blank"
							rel="noreferrer noopener"
						>
							<FontAwesomeIcon
								icon={faGithub}
								className="w-24 h-24"
								size="xl"
							/>
						</a>
					)}
				</div>
				<div className="mt-8 xl:mt-0 flex justify-center xl:justify-end">
					{modelPath ? (
						<Model path={modelPath}></Model>
					) : imagePath ? (
						<img
							src={imagePath}
							alt={title}
							className="mx-auto xl:ml-40 w-auto h-70"
						/>
					) : (
						<p className="text-gray-500">No preview available</p>
					)}
				</div>
			</div>
		</div>
	);
}

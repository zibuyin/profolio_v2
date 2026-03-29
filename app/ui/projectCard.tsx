import { use } from "react";
import Model from "./modelRenderers/renderModel";
import { useRouter } from "next/navigation";
interface ProjectCardProps {
	title: string;
	description: string;
	url: string;
	modelPath: string;
}

export default function ProjectCard({
	title,
	description,
	url,
	modelPath,
}: ProjectCardProps) {
	const router = useRouter();

	return (
		<div className="medication-dispenser-section">
			<div className="flex justify-between">
				<div className="text-section w-200">
					<h2 className="text-3xl">{title}</h2>
					<p className="mt-2">{description}</p>
					<button
						className="bg-blue-700 hover:bg-blue-600 p-1 pr-1.5 pl-1.5 mt-3 rounded-full font-medium text-white"
						onClick={() => router.push(url)}
					>
						Learn more
					</button>
				</div>
				<Model path={modelPath}></Model>
			</div>
		</div>
	);
}

"use client";

import ProjectCard from "./projectCard";

const description1 =
	"An affordable automatic pill dispenser that counts and dispenses pills accurately at scheduled times. It will be safe and easy to use, and capable of remote monitoring. Made using 3D-printing technology and environmentally friendly PLA material.";
export default function Projects() {
	return (
		<div className="projects-section">
			<h1 className="text-6xl font-bold mb-5">Projects</h1>
			<ProjectCard
				title="Automatic Medication Dispenser"
				modelPath="models/medicationDispenser.gltf"
				description="dispenses pills accurately at scheduled times. It will be
                            safe and easy to use, and capable of remote monitoring. Made
                            using 3D-printing technology and environmentally friendly
                            LA material"
				url="/pages/automaticMedicationDispenser"
			/>
		</div>
	);
}

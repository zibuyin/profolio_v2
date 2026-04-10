import ProjectPage from "@/src/app/ui/projectPage";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Project: Automatic Medication Dispenser",
	description:
		"Aim to dispense pills accurately at scheduled times. It will be safe and easy to use, and capable of remote monitoring. Made using 3D-printing technology and environmentally friendly PLA material.",
};

export default function AutomaticMedicationDispenser() {
	return (
		<main>
			<ProjectPage
				title="Automatic Medication Dispenser"
				date="March 29, 2026"
				author="Nathan Yin"
				mdPath="automaticMedicationDispenser.md"
			/>
		</main>
	);
}

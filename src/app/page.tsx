import Image from "next/image";
import Gallery from "./ui/gallery";
import Projects from "./ui/projects";
import Welcome from "./ui/welcome";
import ScrollIndicator from "./ui/scrollDownIndicator";

export default function Home() {
	return (
		<div className="flex flex-col flex-1 justify-center pl-[10vw] pr-[10vw] bg-zinc-50 font-sans dark:bg-black">
			<main>
				{/* <ScrollIndicator></ScrollIndicator> */}
				<Welcome></Welcome>
				<Projects></Projects>
			</main>
		</div>
	);
}

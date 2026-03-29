import Image from "next/image";
import Gallery from "./ui/gallery";
import Projects from "./ui/projects";
import Welcome from "./ui/welcome";
import AboutMe from "./ui/aboutMe";
import ScrollIndicator from "./components/scrollDownIndicator";

export default function Home() {
	return (
		<div className="flex flex-col flex-1 justify-center pl-[15vw] pr-[15vw] bg-zinc-50 font-sans dark:bg-black">
			<main>
				<div className="fixed justify-self-center">
					{/* <ScrollIndicator></ScrollIndicator> */}
					<Welcome></Welcome>
				</div>
				<div className="pt-[60vh] mt-[40vh] bg-gradient-to-b from-transparent via-black to-black z-10 relative">
					<Projects></Projects>
					{/* Small padding */}
					<div className="h-30"></div>
					<AboutMe></AboutMe>
				</div>
			</main>
		</div>
	);
}

// "use client";

import { Metadata } from "next";
import Image from "next/image";
import Projects from "./ui/projectSection";
import Welcome from "./ui/welcomeSection";
import AboutMe from "./ui/aboutMeSection";
import ScrollIndicator from "./components/scrollDownIndicator";
import ScrollReveal from "./components/ScrollReveal";
import Footer from "./components/footer";
import Comments from "./components/giscus";
import BlogSection from "./ui/blogSection";
import Contacts from "./ui/contactsSection";
import CopyDetection from "./ui/copyDetection";

let currentY = 0;
// Function to get current scroll distances
function getScrollDistance() {
	// For cross-browser compatibility, use both documentElement and body
	const scrollTop =
		window.pageYOffset ||
		document.documentElement.scrollTop ||
		document.body.scrollTop ||
		0;
	const scrollLeft =
		window.pageXOffset ||
		document.documentElement.scrollLeft ||
		document.body.scrollLeft ||
		0;

	return { x: scrollLeft, y: scrollTop };
}

// window.addEventListener("scroll", () => {
// 	const { x, y } = getScrollDistance();
// 	console.log(`Scrolled: X = ${x}px, Y = ${y}px`);

// 	if (window.location.pathname == "/") {
// 		currentY = y;
// 		console.log("is root");
// 	}
// });

// window.addEventListener("onRouteChangeComplete", () => {
// 	console.log(currentY);
// window.scrollTo(0, 1000);
// });
export const metadata: Metadata = {
	title: "Nathan Yin's Profolio",
	description:
		"Hello! I'm Nathan Yin. This is my profolio page, come take at a look at the projects I make! Maybe leave an email for suggestions?",
};

export default function Home() {
	return (
		<div className="flex flex-col w-auto flex-1 justify-center pl-[20px] pr-[20px] md:pl-[15vw] md:pr-[15vw] bg-zinc-50 font-sans dark:bg-[#0a0a0a]">
			<main>
				<div className="fixed inset-0 flex items-center justify-center pointer-events-none">
					<div className="absolute bottom-20 left-1/2 z-5 pointer-events-auto transform -translate-x-1/2">
						<ScrollIndicator></ScrollIndicator>
					</div>
					<div className="relative z-0 pointer-events-none">
						<Welcome></Welcome>
					</div>
				</div>

				<div className="pt-[100vh] mt-[0vh] bg-gradient-to-b from-transparent via-[#0a0a0a] to-[#0a0a0a] dark:via-[#0a0a0a] dark:to-[#0a0a0a] via-zinc-50 to-zinc-50 z-10 relative pointer-events-none">
					<section id="projects" className="pointer-events-auto">
						<div className="h-30"></div>

						<Projects></Projects>
					</section>

					{/* Small padding */}

					<section id="about" className="pointer-events-auto">
						<div className="h-30"></div>
						<AboutMe></AboutMe>
					</section>

					<section id="blog" className="pointer-events-auto">
						<div className="h-30"></div>
						<BlogSection></BlogSection>
					</section>
					<section id="contacts" className="pointer-events-auto">
						<div className="h-30"></div>
						<Contacts></Contacts>
					</section>
				</div>
			</main>
		</div>
	);
}

// Whenever I need it :3
// bg-zinc-50 dark:bg-black

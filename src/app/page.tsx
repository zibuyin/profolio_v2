// "use client";

import { Metadata } from "next";
import Image from "next/image";
import Projects from "./ui/projects";
import Welcome from "./ui/welcome";
import AboutMe from "./ui/aboutMe";
import ScrollIndicator from "./components/scrollDownIndicator";
import ScrollReveal from "./components/ScrollReveal";
import Footer from "./components/footer";
import Comments from "./components/giscus";
import BlogSection from "./ui/blogSection";
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
				<div className="fixed inset-0 flex items-center justify-center">
					{/* <ScrollIndicator></ScrollIndicator> */}
					<Welcome></Welcome>
				</div>
				{/* 60/40 ratio for making to transparent before moving, */}
				<div className="pt-[80vh] mt-[50vh] bg-gradient-to-b from-transparent via-[#0a0a0a] to-[#0a0a0a] dark:via-[#0a0a0a] dark:to-[#0a0a0a] via-zinc-50 to-zinc-50 z-10 relative">
					<section id="projects">
						<div className="h-30"></div>
						<Projects></Projects>
					</section>

					{/* Small padding */}

					<section id="about">
						<div className="h-30"></div>
						<AboutMe></AboutMe>
					</section>

					<section id="blog">
						<div className="h-30"></div>
						<BlogSection></BlogSection>
					</section>
				</div>
			</main>
		</div>
	);
}

// Whenever I need it :3
// bg-zinc-50 dark:bg-black

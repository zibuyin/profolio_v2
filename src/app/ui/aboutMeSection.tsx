"use client";

import { useTranslations } from "next-intl";
import LogoLoop from "@/src/app/components/LogoLoop";
import type { LogoItem } from "@/src/app/components/LogoLoop";

const programmingLogos: LogoItem[] = [
	{
		src: "https://cdn.simpleicons.org/python",
		title: "Python",
		href: "https://www.python.org",
	},
	{
		src: "https://pyga.me/docs/_static/pygame_ce_tiny.webp",
		title: "Pygame CE",
		href: "https://pyga.me",
	},
	{
		src: "https://cdn.simpleicons.org/micropython/2563EB",
		title: "MicroPython",
		href: "https://micropython.org",
	},
	{
		src: "https://cdn.simpleicons.org/javascript",
		title: "JavaScript",
		href: "https://developer.mozilla.org/docs/Web/JavaScript",
	},
	{
		src: "https://cdn.simpleicons.org/typescript",
		title: "TypeScript",
		href: "https://www.typescriptlang.org",
	},
	{
		src: "https://cdn.simpleicons.org/html5",
		title: "HTML5",
		href: "https://developer.mozilla.org/docs/Web/HTML",
	},
	{
		src: "https://cdn.simpleicons.org/css",
		title: "CSS",
		href: "https://developer.mozilla.org/docs/Web/CSS",
	},
	{
		src: "https://cdn.simpleicons.org/react",
		title: "React",
		href: "https://react.dev",
	},
	{
		src: "https://cdn.simpleicons.org/nextdotjs/white",
		title: "Next.js",
		href: "https://nextjs.org",
	},
	{
		src: "https://cdn.simpleicons.org/tailwindcss",
		title: "Tailwind CSS",
		href: "https://tailwindcss.com",
	},
	{
		src: "https://cdn.simpleicons.org/threedotjs/white",
		title: "Three.js",
		href: "https://threejs.org",
	},
	{
		src: "https://cdn.simpleicons.org/materialdesign",
		title: "Material Design",
		href: "https://m3.material.io",
	},
	{
		src: "https://cdn.simpleicons.org/raspberrypi",
		title: "Raspberry Pi",
		href: "https://www.raspberrypi.com",
	},
	{
		src: "https://cdn.simpleicons.org/ubuntu",
		title: "Ubuntu",
		href: "https://ubuntu.com",
	},
];

const engineeringLogos: LogoItem[] = [
	{
		src: "onshape.png",
		title: "Onshape",
		href: "https://www.onshape.com",
	},
	{
		src: "https://cdn.simpleicons.org/autocad",
		title: "AutoCAD",
		href: "https://www.autodesk.com/products/autocad",
	},
	{
		src: "https://cdn.simpleicons.org/numpy",
		title: "NumPy",
		href: "https://numpy.org",
	},
	{
		src: "https://cdn.simpleicons.org/bambulab",
		title: "Bambu Lab",
		href: "https://bambulab.com",
	},
	{
		src: "https://cdn.simpleicons.org/kicad",
		title: "KiCad",
		href: "https://www.kicad.org",
	},
];

export default function AboutMe() {
	const t = useTranslations("ProjectCards");

	return (
		<div className="projects-section flex flex-col">
			<h1 className="text-4xl md:text-5xl font-bold mb-5 md:mb-5">
				About Me
			</h1>
			<p className="text-l md:text-xl font-bold mb-2">
				Basically the Wiki section about myself
			</p>
			<ul className="list-disc mb-5 ml-5 text-[18px]">
				<p className="-ml-5 font-bold">General Info</p>
				<li>I currently study in the UK 🏫</li>
				<li>I am into engineering, computer science, and medicine</li>
				{/* <li>I use edge on MacOS btw (plz don't hate me)</li> */}
				<li>
					I own a 3D printing and often use it to make useful items
				</li>
				<li>
					I often participate in{" "}
					<a
						href="https://hackclub.com/"
						className="underline underline-offset-3 text-blue-500"
					>
						Hack Club
					</a>{" "}
					events
				</li>

				<p className="-ml-5 font-bold mt-2">Stuff I like to do</p>
				<li>Drink coconut flavoured coffee</li>
				<li>3D Printing and CAD Modeling</li>
				<li>Webdev, especially react and Next.js</li>
				{/* <li>
					<a
						href="https://en.wikipedia.org/wiki/DevOps"
						className="underline underline-offset-3 text-blue-500"
					>
						DevOps
					</a>
				</li> */}
				<li>
					Do lab work (I had an one week work experience in a research
					centre!)
				</li>
			</ul>
			<p className="text-xl font-bold mb-5 mt-5">
				Here are some tools that I use for programming
			</p>
			<LogoLoop
				logos={programmingLogos}
				speed={60}
				direction="left"
				logoHeight={40}
				gap={40}
				hoverSpeed={0}
				scaleOnHover
				fadeOut
				ariaLabel="Programming Tools"
			/>
			<h3 className="text-xl font-bold mt-5 mb-5">And for engineering</h3>

			<LogoLoop
				logos={engineeringLogos}
				speed={60}
				direction="left"
				logoHeight={40}
				gap={40}
				hoverSpeed={0}
				scaleOnHover
				fadeOut
				ariaLabel="Engineering Tools"
			/>
		</div>
	);
}

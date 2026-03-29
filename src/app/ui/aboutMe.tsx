"use client";

import { useTranslations } from "next-intl";
const iconSize = 42;
function ProgrammingIcons() {
	return (
		<div className="tools-list mt-3 flex gap-5 flex-wrap">
			<img
				height={iconSize}
				width={iconSize}
				src="https://cdn.simpleicons.org/python"
			/>
			<img
				height={iconSize}
				width={iconSize}
				src="https://pyga.me/docs/_static/pygame_ce_tiny.webp"
			/>
			<img
				height={iconSize}
				width={iconSize}
				src="https://cdn.simpleicons.org/micropython/2563EB"
			/>
			<img
				height={iconSize}
				width={iconSize}
				src="https://cdn.simpleicons.org/javascript"
			/>
			<img
				height={iconSize}
				width={iconSize}
				src="https://cdn.simpleicons.org/typescript"
			/>
			<img
				height={iconSize}
				width={iconSize}
				src="https://cdn.simpleicons.org/html5"
			/>
			<img
				height={iconSize}
				width={iconSize}
				src="https://cdn.simpleicons.org/css"
			/>
			<img
				height={iconSize}
				width={iconSize}
				src="https://cdn.simpleicons.org/react"
			/>
			<img
				height={iconSize}
				width={iconSize}
				src="https://cdn.simpleicons.org/nextdotjs/white"
			/>
			<img
				height={iconSize}
				width={iconSize}
				src="https://cdn.simpleicons.org/tailwindcss"
			/>
			<img
				height={iconSize}
				width={iconSize}
				src="https://cdn.simpleicons.org/threedotjs/white"
			/>
			<img
				height={iconSize}
				width={iconSize}
				src="https://cdn.simpleicons.org/materialdesign"
			/>
			<img
				height={iconSize}
				width={iconSize}
				src="https://cdn.simpleicons.org/raspberrypi"
			/>
			<img
				height={iconSize}
				width={iconSize}
				src="https://cdn.simpleicons.org/ubuntu"
			/>
			<img
				height={iconSize}
				width={iconSize}
				src="https://cdn.simpleicons.org/macos/white"
			/>
			<img
				height={iconSize}
				width={iconSize}
				src="https://cdn.simpleicons.org/simpleicons/white"
			/>
		</div>
	);
}

function EngineeringIcons() {
	return (
		<div className="tools-list mt-3 flex gap-5 flex-wrap">
			<img height={iconSize} width={iconSize} src="/images/onshape.png" />
			<img
				height={iconSize}
				width={iconSize}
				src="https://cdn.simpleicons.org/autocad"
			/>
			<img
				height={iconSize}
				width={iconSize}
				src="https://cdn.simpleicons.org/numpy"
			/>
			<img
				height={iconSize}
				width={iconSize}
				src="https://cdn.simpleicons.org/bambulab"
			/>
			<img
				height={iconSize}
				width={iconSize}
				src="https://cdn.simpleicons.org/kicad"
			/>
		</div>
	);
}
export default function AboutMe() {
	const t = useTranslations("ProjectCards");

	return (
		<div className="projects-section flex flex-col">
			<h1 className="text-6xl font-bold mb-6">About Me</h1>
			<h2 className="text-2xl font-bold mb-5">
				I like to do programming and also engineering as a hobby. I
				mostly do web development, sometimes I do game development using
				Pygame.
			</h2>
			<p className="text-xl font-bold">
				Here are some tools that I use for programming
			</p>
			<ProgrammingIcons></ProgrammingIcons>
			<h3 className="text-xl font-bold mt-5">And for Engineering</h3>

			<EngineeringIcons></EngineeringIcons>
		</div>
	);
}

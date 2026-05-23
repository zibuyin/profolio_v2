"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

export default function ScrollIndicator() {
	const [scrollProgress, setScrollProgress] = useState(0);

	useEffect(() => {
		const calculateProgress = () => {
			const viewportHeight = Math.max(window.innerHeight, 1);
			const fadeStart = viewportHeight * 0.08;
			const fadeEnd = viewportHeight * 0.55;
			const rawProgress =
				(window.scrollY - fadeStart) / (fadeEnd - fadeStart);
			const clampedProgress = Math.max(0, Math.min(1, rawProgress));

			setScrollProgress((previous) => {
				if (Math.abs(previous - clampedProgress) < 0.01) {
					return previous;
				}
				return clampedProgress;
			});
		};

		calculateProgress();
		window.addEventListener("scroll", calculateProgress, { passive: true });
		window.addEventListener("resize", calculateProgress);

		return () => {
			window.removeEventListener("scroll", calculateProgress);
			window.removeEventListener("resize", calculateProgress);
		};
	}, []);

	const easedProgress = Math.pow(scrollProgress, 1.35);
	const indicatorOpacity = 1 - easedProgress;
	const indicatorBlur = easedProgress * 2;
	const indicatorY = easedProgress * -16;

	return (
		<div
			className="flex flex-col gap-2 items-center justify-center pointer-events-auto"
			style={{
				opacity: indicatorOpacity,
				filter: `blur(${indicatorBlur}px)`,
				transform: `translateY(${indicatorY}px)`,
				willChange: "opacity, transform, filter",
			}}
		>
			{/* <p>Welcome</p> */}
			<button
				type="button"
				aria-label="Scroll to projects"
				className="cursor-pointer p-4 rounded-full"
				onClick={() => {
					// console.log("TEST");
					const projectsSection = document.getElementById("projects");
					if (projectsSection) {
						projectsSection.scrollIntoView({
							behavior: "smooth",
							block: "start",
						});
						return;
					}

					window.scrollBy({
						top: window.innerHeight,
						behavior: "smooth",
					});
				}}
			>
				<FontAwesomeIcon
					icon={faAngleDown}
					bounce
					className="justify-self-center scale-200"
				/>
			</button>
		</div>
	);
}

{
	/* <div className="absolute bottom-20 left-1/2 z-30 transform -translate-x-1/2">
					
				</div> */
}

"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

export default function ScrollIndicator() {
	return (
		<div className="flex flex-col gap-2 items-center justify-center pointer-events-auto">
			{/* <p>Welcome</p> */}
			<button
				type="button"
				aria-label="Scroll to projects"
				className="cursor-pointer p-4 rounded-full"
				onClick={() => {
					console.log("TEST");
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

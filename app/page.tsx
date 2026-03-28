import Image from "next/image";
import Gallery from "./ui/gallery";

export default function Home() {
	return (
		<div className="flex flex-col flex-1 justify-center pl-[10vw] pr-[10vw] bg-zinc-50 font-sans dark:bg-black">
			<main>
				<div className="welcome-section h-screen justify-center flex flex-col flex-1">
					<div className="flex flex-row justify-between">
						<div>
							<h1 className="text-5xl md:text-8xl font-bold name-title">
								Nathan Yin
							</h1>
							<h2 className="text-lg md:text-3xl mb-1">
								Engineer • Programmer
							</h2>
						</div>

						<Gallery></Gallery>
					</div>
				</div>

				<div className="projects-section">
					<h1 className="text-6xl font-bold">Projects</h1>
				</div>
			</main>
		</div>
	);
}

"use client";

import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeCommit } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
	const pathname: string = usePathname();
	const isProjects: boolean = pathname.includes("projects");

	return (
		<footer
			className={
				isProjects
					? "h-[5vh] bg-zinc-50 dark:bg-black z-888 pt-[7vh] pb-[7vh] ml-[27vw] mr-[27vw] flex flex-row justify-between"
					: "h-[5vh] bg-zinc-50 dark:bg-black z-888 pt-[7vh] pb-[7vh] ml-[15vw] mr-[15vw] flex flex-row justify-between"
			}
		>
			<a href="github.com/zibuyin/">
				<p className="text-gray-500">
					<FontAwesomeIcon icon={faCodeCommit} />{" "}
					{process.env.NEXT_PUBLIC_GIT_HASH}
				</p>
			</a>
			<p className="text-gray-500">© Nathan Yin 2026</p>
		</footer>
	);
}

"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeCommit } from "@fortawesome/free-solid-svg-icons";
import StatusBadge from "../ui/statusBadge";
import SystemStatus from "../ui/newStatusBadge";

function timeAgo(dateString: string) {
	const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
	const diff = (new Date(dateString).getTime() - Date.now()) / 1000;

	if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), "second");
	if (Math.abs(diff) < 3600)
		return rtf.format(Math.round(diff / 60), "minute");
	if (Math.abs(diff) < 86400)
		return rtf.format(Math.round(diff / 3600), "hour");
	if (Math.abs(diff) < 2592000)
		return rtf.format(Math.round(diff / 86400), "day");

	return new Date(dateString).toLocaleDateString();
}

export default function Footer() {
	const pathname: string = usePathname();
	const isProjects: boolean = pathname.includes("projects");
	const lastUpdated = useMemo(() => {
		const rawDate = process.env.NEXT_PUBLIC_GIT_LAST_UPDATED;
		if (!rawDate) return "unknown";
		return timeAgo(rawDate);
	}, []);

	return (
		<footer
			className={
				isProjects
					? "h-[5vh] bg-zinc-50 dark:bg-black z-888 pt-[7vh] pb-[7vh] ml-[30px] mr-[30px] xl:ml-[25vw] xl:mr-[25vw] flex flex-row justify-between items-center"
					: "h-[5vh] bg-zinc-50 dark:bg-black z-888 pt-[7vh] pb-[7vh] pl-[20px] pr-[20px] xl:ml-[15vw] xl:mr-[15vw] flex flex-row justify-between items-center"
			}
		>
			<a href="https://github.com/zibuyin/profolio_v2">
				<p className="text-gray-500">
					<FontAwesomeIcon icon={faCodeCommit} />{" "}
					{process.env.NEXT_PUBLIC_GIT_HASH} - {lastUpdated}
				</p>
			</a>
			{/* <StatusBadge></StatusBadge> */}
			<SystemStatus></SystemStatus>
			<p className="text-gray-500">© Nathan Yin 2026</p>
		</footer>
	);
}

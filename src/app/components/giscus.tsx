"use client";
import Giscus from "@giscus/react";

export default function Comments() {
	return (
		<>
			<p className="text-gray-500 mb-5">
				*Github account is required for commenting due to the how giscus
				works. Find out more{" "}
				<a
					href="https://giscus.app/"
					className="italic underline text-blue-500"
				>
					here
				</a>
			</p>
			<Giscus
				repo="zibuyin/profolio_v2"
				repoId="R_kgDOR1Ha2g"
				category="Announcements"
				categoryId="DIC_kwDOR1Ha2s4C6MIo"
				mapping="pathname"
				strict="1"
				reactionsEnabled="1"
				emitMetadata="1"
				inputPosition="top"
				theme="preferred_color_scheme"
				lang="en"
			/>
		</>
	);
}

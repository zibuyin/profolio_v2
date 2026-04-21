"use client";

import Tiptap from "../components/TipTap";
import { useEffect, useState } from "react";

// Icons
import { FaChevronDown } from "react-icons/fa";

export default function Page() {
	const [expanded, setExpanded] = useState(false);

	return (
		<div className="flex flex-col w-auto flex-1 pl-[20px] pr-[20px] md:pl-[15vw] md:pr-[15vw] bg-zinc-50 font-sans dark:bg-[#0a0a0a]">
			<div className="back-btn mt-10 w-fit h-fit">
				<h1 className="text-4xl md:text-5xl font-bold">Admin Panel</h1>
			</div>

			<div className="flex flex-col bg-mist-900 rounded-4xl p-5 w-full mt-10 transition-all">
				<button
					onClick={() =>
						expanded ? setExpanded(false) : setExpanded(true)
					}
					// className="inline-block bg-blue-700 hover:bg-blue-600 p-2 pr-3 pl-3 rounded-full font-medium text-white"
				>
					<div className="header flex flex-rol justify-between items-center">
						<h2 className="text-xl md:text-2xl font-bold m-0 p-0">
							Project Posts
						</h2>

						<FaChevronDown></FaChevronDown>
					</div>
				</button>

				{expanded && (
					<div className="flex flex-col editor-area w-full h-auto mt-6">
						<div className="flex flex-col mb-5 justify-between gap-5">
							<input
								placeholder="Title"
								className="border-3 rounded-2xl h-10 p-2 flex"
							></input>
							<input
								placeholder="Date"
								className="border-3 rounded-2xl h-10 p-2"
							></input>
							<input
								placeholder="Author (Default: Nathan Yin)"
								className="border-3 rounded-2xl p-2"
							></input>
							<input
								placeholder="Description"
								className="border-3 rounded-2xl h-10 p-2 pt-5 pb-30"
							></input>
						</div>
						<Tiptap></Tiptap>
						<div className="flex flex-row gap-5 mt-6">
							<button className="inline-block bg-green-700 hover:bg-green-600 p-2 pr-3 pl-3 rounded-full font-medium text-white">
								Save Draft
							</button>
							<button className="inline-block bg-blue-700 hover:bg-blue-600 p-2 pr-3 pl-3 rounded-full font-medium text-white">
								Publish
							</button>

							<button className="inline-block bg-red-700 hover:bg-red-600 p-2 pr-3 pl-3 rounded-full font-medium text-white">
								Delete
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

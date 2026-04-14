"use client";

import { useEffect, useRef, useState } from "react";
import { FaRegCopyright } from "react-icons/fa";

export default function CopyDetection() {
	const [showPopup, setShowPopup] = useState(false);
	const hideTimerRef = useRef<number | null>(null);

	useEffect(() => {
		const copyHandler = () => {
			setShowPopup(true);
		};

		document.addEventListener("copy", copyHandler);

		return () => {
			document.removeEventListener("copy", copyHandler);
			if (hideTimerRef.current !== null) {
				window.clearTimeout(hideTimerRef.current);
				hideTimerRef.current = null;
			}
		};
	}, []);

	if (!showPopup) {
		return null;
	}

	return (
		<div id="popup">
			<div className="fixed inset-0 bg-black/60 backdrop-blur-md z-40" />
			<div className="fixed inset-0 z-50 flex items-center justify-center ">
				<div className="bg-mist-900 w-[80vw] md:w-[30vw] h-[39vh] opacity-100 rounded-2xl text-center p-7">
					<h1 className="text-4xl font-black mb-5">Hold Up ⚠️</h1>
					<p className="mb-2 md:mb-5">
						This website's contents are under the{" "}
						<a
							href="https://creativecommons.org/licenses/by-nc/4.0/"
							className="text-blue-500 underline underline-offset-3"
						>
							CC BY-NC 4.0 International License
						</a>
					</p>
					<p>
						This means that you are{" "}
						<span className="text-yellow-300">free to use</span> to
						the contents or{" "}
						<span className="text-yellow-300">
							remix and build upon it
						</span>
						, but you must give{" "}
						<span className="text-red-300 font-bold">
							appropriate credit{" "}
						</span>
						and{" "}
						<span className="text-red-300 font-bold">
							must not use it for commercial purposes.
						</span>
					</p>
					{/* <img src="https://licensebuttons.net/l/by-nc/3.0/88x31.png"></img> */}
					<button
						className="inline-block bg-blue-700 hover:bg-blue-600 p-2 pr-3 pl-3 rounded-full font-medium text-white mt-[3vh]"
						onClick={() => setShowPopup(false)}
					>
						I Agree
					</button>
				</div>
			</div>
		</div>
	);
}

"use client";

import { FaPause } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

interface MusicCardsProps {
	title: string;
	author: string;
}

function TimeLine({ id }: { id: string }) {
	const [dims, setDims] = useState<{
		trackWidth: number;
		thumbWidth: number;
	} | null>(null);

	useEffect(() => {
		const audioPlayer = document.getElementById(
			`id-${id}`,
		) as HTMLAudioElement;
		const wrapper = document.getElementById(
			`id-timeline-${id}`,
		) as HTMLDivElement;

		if (!audioPlayer || !wrapper) return;

		const fullWidth = parseFloat(getComputedStyle(wrapper).width);
		const duration = audioPlayer.duration;
		const currentTime = audioPlayer.currentTime;
		const ratio =
			isFinite(duration) && duration > 0 ? currentTime / duration : 0;
		const trackWidth = fullWidth;
		const thumbWidth = trackWidth * ratio;

		setDims({ trackWidth, thumbWidth });
	}, [id]);

	if (!dims) return null;

	return (
		<div
			className={`track h-2 rounded-full bg-gray-400`}
			style={{ width: `${dims.trackWidth}px` }}
		>
			<div
				className={`h-full rounded-l-3xl bg-sky-400`}
				style={{ width: `${dims.thumbWidth}px` }}
			></div>
		</div>
	);
}
function toggleAudio(paused: boolean, id: string) {
	console.log("toggling audio");
	let audioPlayer = null;
	if (typeof window !== "undefined") {
		audioPlayer = document.getElementById(`id-${id}`) as HTMLAudioElement;
	}
	console.log(audioPlayer);
	// null prevention
	if (audioPlayer) {
		if (paused) {
			audioPlayer.play();
		} else {
			audioPlayer.pause();
		}
	}
}

export default function MusicCard({ title, author }: MusicCardsProps) {
	const slug = `${title.toLowerCase()}-${author.toLowerCase()}`;
	const cdnMusicDirUrl = `https://pp2.cdn.nathanyin.com/music/${slug}/`;
	const audioPath = `${cdnMusicDirUrl}music.mp3`;
	const thumbnailPath = `${cdnMusicDirUrl}thumbnail.webp`;
	const [paused, setPaused] = useState(true);
	const [tick, setTick] = useState(0);
	useEffect(() => {
		const interval = setInterval(() => {
			setTick((t) => t + 1);
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div>
			<audio className="audio hidden" id={`id-${slug}`} controls>
				<source src={audioPath} type="audio/mpeg" />
			</audio>

			<div
				className={`${paused ? "shadow-none" : "shadow-[0_0_10px_#38bdf8] border-0"} flex flex-row h-35 w-full justify-self-center sm:w-120 sm:justify-self-auto border-1 border-gray-300 dark:border-gray-600 p-4 rounded-2xl bg-gray-100/80 dark:bg-zinc-900/80 backdrop-blur-sm gap-5 transition-all mt-5 mb-5`}
			>
				<img
					src={thumbnailPath}
					className="rounded-xl"
					style={{
						width: "108px",
						height: "108px",
						margin: "0px",
					}}
				></img>
				<div className="text-center flex-1 flex flex-col justify-between">
					{/* Labels */}
					<div>
						<p className="text-xl">{title}</p>
						<p className="text text-gray-700 dark:text-gray-300">
							{author}
						</p>
					</div>
					{/* Controls */}
					<div className="flex flex-row items-center gap-5">
						{/* Pause btn */}
						<div
							onClick={() => {
								paused ? setPaused(false) : setPaused(true);
								toggleAudio(paused, slug);
							}}
							className="p-2.5 w-fit rounded-full bg-sky-400 hover:scale-107 active:scale-93 transition-all ease-in-out text-sm"
						>
							{paused ? (
								<FaPlay className="scale-75" />
							) : (
								<FaPause className="scale-75" />
							)}
						</div>
						<div className="flex-1" id={`id-timeline-${slug}`}>
							<TimeLine key={tick} id={slug} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

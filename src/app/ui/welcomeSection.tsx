"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ShinyText from "../components/ShinyText";
import DecryptedText from "../components/DecryptedText";
import Link from "next/link";

export default function Welcome() {
	const t = useTranslations("WelcomeSection");
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
	const titleOpacity = 1 - easedProgress;
	const titleBlur = easedProgress * 2;
	const titleY = easedProgress * -16;

	return (
		<>
			<Link
				href="/admin"
				className="absolute top-0 left-0 w-10 h-10 opacity-0 cursor-default"
			></Link>
			<div className="welcome-section h-screen flex flex-col items-center justify-center text-center">
				<div>
					{/* Name */}
					{/* <h1 className="text-5xl md:text-8xl font-bold name-title">
					{t("title")}
				</h1> */}
					<div
						style={{
							opacity: titleOpacity,
							filter: `blur(${titleBlur}px)`,
							transform: `translateY(${titleY}px)`,
							willChange: "opacity, transform, filter",
						}}
					>
						<ShinyText
							className="text-5xl md:text-8xl font-bold name-title"
							text={t("title")}
							speed={2}
							delay={0}
							color="#b2b2b2"
							shineColor="#ffffff"
							spread={120}
							direction="left"
							yoyo={false}
							pauseOnHover={false}
							disabled={false}
						/>
					</div>
					{/* Roles */}
					{/* <h2 className="text-lg md:text-3xl mb-1">{t("subtitle")}</h2> */}
					<div
						className="text-lg md:text-3xl mb-1"
						style={{
							marginTop: "0rem",
							opacity: titleOpacity,
							filter: `blur(${titleBlur}px)`,
							transform: `translateY(${titleY}px)`,
							willChange: "opacity, transform, filter",
						}}
					>
						<DecryptedText
							text={t("subtitle")}
							animateOn="view"
							revealDirection="start"
							sequential
							useOriginalCharsOnly={false}
							speed={50}
						/>
					</div>
					{/* <p className="mt-5 text-gray-500">
					Latest Post: This is a preview of the blog update... (2 days
					ago)
				</p> */}
				</div>
			</div>
		</>
	);
}

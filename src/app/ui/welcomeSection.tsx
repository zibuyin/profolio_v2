"use client";

import { useTranslations } from "next-intl";
import ScrollIndicator from "../components/scrollDownIndicator";
import ShinyText from "../components/ShinyText";
import DecryptedText from "../components/DecryptedText";
import StatusBadge from "./statusBadge";
import Link from "next/link";

export default function Welcome() {
	const t = useTranslations("WelcomeSection");
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
					{/* Roles */}
					{/* <h2 className="text-lg md:text-3xl mb-1">{t("subtitle")}</h2> */}
					<div
						className="text-lg md:text-3xl mb-1"
						style={{ marginTop: "0rem" }}
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

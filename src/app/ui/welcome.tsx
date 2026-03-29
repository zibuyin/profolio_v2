import { useTranslations } from "next-intl";
import ScrollIndicator from "../components/scrollDownIndicator";

export default function Welcome() {
	const t = useTranslations("WelcomeSection");
	return (
		<div className="welcome-section h-screen items-center content-center text-center">
			<div className="place-center">
				<div>
					{/* Name */}
					<h1 className="text-5xl md:text-8xl font-bold name-title">
						{t("title")}
					</h1>
					{/* Roles */}
					<h2 className="text-lg md:text-3xl mb-1">
						{t("subtitle")}
					</h2>
				</div>
			</div>
			<div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
				<ScrollIndicator />
			</div>
		</div>
	);
}

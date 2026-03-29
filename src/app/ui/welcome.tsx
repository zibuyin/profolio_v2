import { useTranslations } from "next-intl";

export default function Welcome() {
	const t = useTranslations("WelcomeSection");
	return (
		<div className="welcome-section h-screen justify-center flex flex-col flex-1">
			<div className="flex flex-row justify-between">
				<div>
					<h1 className="text-5xl md:text-8xl font-bold name-title">
						{t("title")}
					</h1>
					<h2 className="text-lg md:text-3xl mb-1">
						{t("subtitle")}
					</h2>
				</div>

				{/* <Gallery></Gallery> */}
			</div>
		</div>
	);
}

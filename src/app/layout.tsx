import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import CounterModule from "./components/counterComponent";
import "./globals.css";
import Footer from "./components/footer";

export const metadata: Metadata = {
	title: "Nathan Yin's Profolio",
	description:
		"Hello! I'm Nathan Yin. This is my profolio page, come take at a look at the projects I make! Maybe leave an email for suggestions?",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full antialiased">
			<body className="min-h-full flex flex-col">
				<NextIntlClientProvider>{children}</NextIntlClientProvider>
				<Footer />
				{/* <CounterModule /> */}
			</body>
		</html>
	);
}

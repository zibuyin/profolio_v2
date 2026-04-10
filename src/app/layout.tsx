import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import CounterModule from "./components/counterComponent";
import "./globals.css";
import Footer from "./components/footer";

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

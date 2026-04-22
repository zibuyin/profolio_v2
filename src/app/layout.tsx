import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";
import Footer from "./components/footer";
import CopyDetection from "./ui/copyDetection";
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en" className="h-full antialiased">
				<body className="min-h-full flex flex-col">
					<NextIntlClientProvider>{children}</NextIntlClientProvider>
					<CopyDetection></CopyDetection>
					<Footer />
					{/* <CounterModule /> */}
				</body>
			</html>
		</ClerkProvider>
	);
}

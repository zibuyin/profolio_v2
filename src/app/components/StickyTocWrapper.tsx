"use client";
import { useEffect, useRef, useState } from "react";

export default function StickyTocWrapper({
	children,
	initialTop,
	fixedTop,
	right,
}: {
	children: React.ReactNode;
	initialTop: number;
	fixedTop: number;
	right: number;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [isFixed, setIsFixed] = useState(false);

	useEffect(() => {
		function onScroll() {
			setIsFixed(window.scrollY + fixedTop >= initialTop);
		}
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [initialTop, fixedTop]);

	return (
		<>
			{/* placeholder to hold space when fixed */}
			{isFixed && (
				<div
					ref={ref}
					style={{ width: "auto", height: 0, pointerEvents: "none" }}
				/>
			)}
			<div
				style={
					isFixed
						? { position: "fixed", top: fixedTop, right }
						: { position: "absolute", top: initialTop, right }
				}
				className="w-fit hidden xl:block z-50"
			>
				{children}
			</div>
		</>
	);
}

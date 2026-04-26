"use client";
import { useEffect, useRef, useState } from "react";

export type TocNode = {
	depth: number;
	value: string;
	children?: TocNode[];
};

function slugify(value: string): string {
	return value
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.trim()
		.replace(/[\s_]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function flattenNodes(nodes: TocNode[]): TocNode[] {
	return nodes.flatMap((n) => [n, ...flattenNodes(n.children ?? [])]);
}

export default function TOC({ nodes }: { nodes: TocNode[] }) {
	const filtered = nodes.filter(
		(item) => !(item.depth === 2 && item.value.includes("title:")),
	);
	const allFlat = flattenNodes(filtered);

	const [activeId, setActiveId] = useState<string>("");
	const [thumbTop, setThumbTop] = useState(0);
	const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
	const trackRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ids = allFlat.map((n) => slugify(n.value));
		const observers: IntersectionObserver[] = [];

		ids.forEach((id) => {
			const el = document.getElementById(id);
			if (!el) return;
			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) setActiveId(id);
				},
				{ rootMargin: "0px 0px -70% 0px", threshold: 0 },
			);
			observer.observe(el);
			observers.push(observer);
		});

		return () => observers.forEach((o) => o.disconnect());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nodes]);

	// Move thumb to the active button's vertical centre within the track
	useEffect(() => {
		if (!activeId || !trackRef.current) return;
		const btn = itemRefs.current[activeId];
		if (!btn) return;
		const trackRect = trackRef.current.getBoundingClientRect();
		const btnRect = btn.getBoundingClientRect();
		setThumbTop(btnRect.top - trackRect.top + btnRect.height / 2);
	}, [activeId]);

	function scrollTo(value: string) {
		const id = slugify(value);
		document
			.getElementById(id)
			?.scrollIntoView({ behavior: "smooth", block: "start" });
	}

	function renderNode(item: TocNode, i: number, parentKey: string) {
		const key = `${parentKey}-${item.depth}-${item.value}-${i}`;
		const id = slugify(item.value);
		const isActive = activeId === id;
		const indent = (item.depth - 1) * 10;
		const Tag = `h${Math.min(item.depth, 6)}` as
			| "h1"
			| "h2"
			| "h3"
			| "h4"
			| "h5"
			| "h6";

		return (
			<div key={key} style={{ paddingLeft: indent }}>
				<button
					ref={(el) => {
						itemRefs.current[id] = el;
					}}
					onClick={() => scrollTo(item.value)}
					className={`toc-btn${isActive ? " toc-active" : ""}`}
				>
					<Tag className="toc-item">{item.value}</Tag>
				</button>
				{item.children?.map((child, ci) => renderNode(child, ci, key))}
			</div>
		);
	}

	return (
		<div className="toc-wrapper">
			<div ref={trackRef} className="toc-track">
				<div className="toc-thumb" style={{ top: thumbTop }} />
			</div>
			<div className="toc-element-wrapper">
				{filtered.map((item, i) => renderNode(item, i, "toc"))}
			</div>
		</div>
	);
}

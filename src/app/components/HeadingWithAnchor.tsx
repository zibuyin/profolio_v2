import React from "react";

function slugify(children: React.ReactNode): string {
	const text = extractText(children);
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.trim()
		.replace(/[\s_]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function extractText(node: React.ReactNode): string {
	if (typeof node === "string" || typeof node === "number")
		return String(node);
	if (Array.isArray(node)) return node.map(extractText).join("");
	if (React.isValidElement(node)) {
		const el = node as React.ReactElement<{ children?: React.ReactNode }>;
		return extractText(el.props.children);
	}
	return "";
}

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const sizeClasses: Record<HeadingTag, string> = {
	h1: "text-3xl font-bold mt-8 mb-3",
	h2: "text-2xl font-bold mt-7 mb-2",
	h3: "text-xl font-semibold mt-6 mb-2",
	h4: "text-lg font-semibold mt-5 mb-1",
	h5: "text-base font-semibold mt-4 mb-1",
	h6: "text-sm font-semibold mt-4 mb-1",
};

export function makeHeading(tag: HeadingTag) {
	const Heading = ({ children }: { children?: React.ReactNode }) => {
		const id = slugify(children);
		return React.createElement(
			tag,
			{ id, className: `group ${sizeClasses[tag]}` },
			<>
				{children}
				<a
					href={`#${id}`}
					className="ml-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-200 transition-opacity no-underline"
					aria-hidden="true"
				>
					#
				</a>
			</>,
		);
	};
	Heading.displayName = `Heading_${tag}`;
	return Heading;
}

"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { nord } from "react-syntax-highlighter/dist/esm/styles/hljs";
interface CodeBlockProps {
	className?: string;
	children?: React.ReactNode;
	inline?: boolean;
}

export default function CodeBlock({
	className,
	children,
	inline,
}: CodeBlockProps) {
	const match = /language-(\w+)/.exec(className ?? "");
	const language = match ? match[1] : "text";
	const code = String(children).replace(/\n$/, "");
	const shouldRenderInline =
		Boolean(inline) || (!match && !code.includes("\n"));

	if (shouldRenderInline) {
		return <code className={className}>{children}</code>;
	}

	return (
		<SyntaxHighlighter
			language={language}
			style={oneDark}
			showLineNumbers
			wrapLines
			lineNumberStyle={{
				minWidth: "2.5em",
				paddingRight: "1em",
				userSelect: "none",
			}}
			PreTag="pre"
			codeTagProps={{ style: { display: "block", padding: 0 } }}
			customStyle={{
				borderRadius: "0.25rem",
				marginBottom: "1rem",
				fontSize: "0.875rem",
			}}
		>
			{code}
		</SyntaxHighlighter>
	);
}

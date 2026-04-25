import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root } from "mdast";

type DirectiveNode = {
	type: "containerDirective" | "leafDirective" | "textDirective";
	name?: string;
	attributes?: Record<string, unknown>;
	data?: {
		hName?: string;
		hProperties?: Record<string, unknown>;
	};
};

function classNameFrom(value: unknown): string {
	if (Array.isArray(value)) {
		return value.filter(Boolean).join(" ");
	}
	if (typeof value === "string") {
		return value;
	}
	return "";
}

export const remarkAdmonitions: Plugin<[], Root> = () => {
	return (tree) => {
		visit(
			tree,
			["containerDirective", "leafDirective", "textDirective"],
			(node) => {
				const directiveNode = node as DirectiveNode;
				if (!directiveNode.name) {
					return;
				}

				const data = directiveNode.data || (directiveNode.data = {});
				const attributes = directiveNode.attributes ?? {};
				const existingClassName = classNameFrom(attributes.className ?? attributes.class);

				const blockClass = `admonition admonition-${directiveNode.name}`;
				const className = [blockClass, existingClassName].filter(Boolean).join(" ");

				data.hName = directiveNode.type === "textDirective" ? "span" : "div";
				data.hProperties = {
					...attributes,
					className,
				};
			},
		);
	};
};

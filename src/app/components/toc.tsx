import loadToc from "@/utils/remarkToc";
import { any } from "three/src/nodes/math/MathNode.js";

function clickHandler() {
	//TODO make the section scroll into view smoothly when clicked
}

type TocNode = {
	depth: number;
	value: string;
	children?: TocNode[];
};

export default function TOC({ path }: { path: string }) {
	const toc = loadToc(path) as TocNode[];
	const filtered = toc.filter(
		(item: any) => !(item.depth === 2 && item.value.includes("title:")),
	);

	function renderNode(item: TocNode, i: number, parentKey: string) {
		const key = `${parentKey}-${item.depth}-${item.value}-${i}`;

		const heading =
			item.depth === 1 ? (
				<h1 className="toc-item">{item.value}</h1>
			) : item.depth === 2 ? (
				<h2 className="toc-item">{item.value}</h2>
			) : item.depth === 3 ? (
				<h3 className="toc-item">{item.value}</h3>
			) : (
				<p className="toc-item">{item.value}</p>
			);

		return (
			<div key={key} className="text-left">
				<button>{heading}</button>
				{item.children?.map((child, childIndex) =>
					renderNode(child, childIndex, key),
				)}
			</div>
		);
	}

	return (
		<div className="toc-element-wrapper border-2 border-red-500 h-fit w-fit p-5">
			{filtered.map((item, i) => renderNode(item, i, "toc"))}
		</div>
	);
}

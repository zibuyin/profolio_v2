import { unified } from "unified";
import markdown from "remark-parse";
import extractToc from "remark-extract-toc";

import * as fs from "fs";
import { depth } from "three/src/nodes/display/ViewportDepthNode.js";

export default function loadToc(path: string) {
	const text = fs.readFileSync(path, "utf8");

	const processor = unified().use(markdown).use(extractToc);

	const res = processor.processSync(text);
	console.dir(res.result, { depth: null });
	return res.result;
}

// indexToc("/Users/nathanyin/Documents/Developing/Webdev/profolio_v2/content/project/md/muyu.mdx")

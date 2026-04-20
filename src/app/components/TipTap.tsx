"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const Tiptap = () => {
	const editor = useEditor({
		extensions: [StarterKit],
		content: "<h3>Input Content Here!</h3>",
		// Don't render immediately on the server to avoid SSR issues
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class: "ProseMirror",
			},
		},
	});

	return (
		<div className="tiptap-editor rounded-xl">
			<EditorContent editor={editor} />
		</div>
	);
};

export default Tiptap;

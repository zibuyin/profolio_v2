"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TextSelection } from "@tiptap/pm/state";

interface TiptapProps {
	onImageDropUpload?: (file: File) => Promise<string | null>;
	onContentChange?: (content: string) => void;
	initialContent?: string;
}

const Tiptap = ({
	onImageDropUpload,
	onContentChange,
	initialContent,
}: TiptapProps) => {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Image.extend({
				draggable: true,
			}),
		],
		content: initialContent ?? "<h3>Input Content Here!</h3>",
		// Don't render immediately on the server to avoid SSR issues
		immediatelyRender: false,
		onCreate: ({ editor }) => {
			onContentChange?.(editor.getHTML());
		},
		onUpdate: ({ editor }) => {
			onContentChange?.(editor.getHTML());
		},
		editorProps: {
			handleDrop: (view, event, _slice, moved) => {
				if (moved || !onImageDropUpload) {
					return false;
				}

				const file = event.dataTransfer?.files?.[0];
				if (!file || !file.type.startsWith("image/")) {
					return false;
				}

				event.preventDefault();

				const coordinates = view.posAtCoords({
					left: event.clientX,
					top: event.clientY,
				});
				const dropPos = coordinates?.pos ?? view.state.selection.from;

				view.dispatch(
					view.state.tr.setSelection(
						TextSelection.create(view.state.doc, dropPos),
					),
				);

				void onImageDropUpload(file).then((url) => {
					if (!url || !editor) {
						return;
					}

					editor
						.chain()
						.focus()
						.setImage({ src: url, alt: file.name })
						.run();
				});

				return true;
			},
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

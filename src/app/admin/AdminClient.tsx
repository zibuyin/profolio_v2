"use client";

import Tiptap from "../components/TipTap";
import { useEffect, useRef, useState } from "react";
import { useFileUpload } from "@/src/hooks/useFileUpload";

// Icons
import { FaChevronDown } from "react-icons/fa";

const DRAFT_STORAGE_KEY = "admin.projectPostDraft";

type PostType = "project" | "blog";
type ThumbnailPurpose = "thumbnail-image" | "thumbnail-model";

interface LocalDraft {
	postType: PostType;
	title: string;
	subtitle: string;
	slug: string;
	slugEdited: boolean;
	date: string;
	author: string;
	description: string;
	repoUrl: string;
	content: string;
	imagePath: string;
	modelPath: string;
	cachedImageDataUrl: string;
	cachedImageName: string;
	cachedImageType: string;
	thumbnailDataUrl: string;
	thumbnailName: string;
	thumbnailType: string;
	thumbnailPurpose: ThumbnailPurpose | "";
}

function toCamelSlug(title: string) {
	const words = title
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, " ")
		.split(/\s+/)
		.filter(Boolean);

	if (words.length === 0) {
		return "";
	}

	return words
		.map((word, index) => {
			if (index === 0) {
				return word;
			}
			return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
		})
		.join("");
}

function sanitizeSlugInput(value: string) {
	const cleaned = value.replace(/[^a-zA-Z0-9]/g, "");
	if (!cleaned) {
		return "";
	}
	return `${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}`;
}

function stripBlobImages(content: string) {
	return content.replace(/<img[^>]*src="blob:[^"]*"[^>]*>/g, "");
}

function isImageMime(type: string) {
	return type.startsWith("image/");
}

function detectThumbnailPurpose(file: File): ThumbnailPurpose | null {
	const extension = file.name.includes(".")
		? file.name.split(".").pop()?.toLowerCase() || ""
		: "";

	if (isImageMime(file.type)) {
		return "thumbnail-image";
	}

	if (
		file.type === "model/gltf-binary" ||
		file.type === "model/gltf+json" ||
		file.type === "application/gltf-buffer" ||
		file.type === "application/gltf+json" ||
		extension === "glb" ||
		extension === "gltf"
	) {
		return "thumbnail-model";
	}

	return null;
}

function fileToDataUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result || ""));
		reader.onerror = () =>
			reject(new Error("Failed to read file for local cache"));
		reader.readAsDataURL(file);
	});
}

async function dataUrlToFile(dataUrl: string, fileName: string, type: string) {
	const response = await fetch(dataUrl);
	const blob = await response.blob();
	return new File([blob], fileName, {
		type: type || blob.type || "application/octet-stream",
	});
}

async function uploadAsset(
	file: File,
	slug: string,
	purpose: ThumbnailPurpose,
	adminSecret: string,
): Promise<string> {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		const formData = new FormData();
		formData.append("file", file);
		formData.append("slug", slug);
		formData.append("purpose", purpose);

		xhr.addEventListener("load", () => {
			let responseData: { error?: string; fileUrl?: string } = {};
			try {
				responseData = JSON.parse(xhr.responseText);
			} catch {
				responseData = {};
			}

			if (xhr.status >= 200 && xhr.status < 300 && responseData.fileUrl) {
				resolve(responseData.fileUrl);
				return;
			}

			reject(
				new Error(
					responseData.error || "Failed to upload thumbnail asset",
				),
			);
		});

		xhr.addEventListener("error", () => {
			reject(new Error("Failed to upload thumbnail asset"));
		});

		xhr.open("POST", "/api/upload/direct");
		if (adminSecret) {
			xhr.setRequestHeader("Authorization", `Bearer ${adminSecret}`);
		}
		xhr.send(formData);
	});
}

interface AdminClientProps {
	adminSecret: string;
}

export default function AdminClient({ adminSecret }: AdminClientProps) {
	const [expanded, setExpanded] = useState(true);
	const [postType, setPostType] = useState<PostType>("project");
	const [title, setTitle] = useState("");
	const [subtitle, setSubtitle] = useState("");
	const [slug, setSlug] = useState("");
	const [slugEdited, setSlugEdited] = useState(false);
	const [date, setDate] = useState(() =>
		new Date().toISOString().slice(0, 10),
	);
	const [author, setAuthor] = useState("Nathan Yin");
	const [description, setDescription] = useState("");
	const [repoUrl, setRepoUrl] = useState("");
	const [imagePath, setImagePath] = useState("");
	const [modelPath, setModelPath] = useState("");
	const [editorContent, setEditorContent] = useState(
		"<h3>Input Content Here!</h3>",
	);
	const [editorSeed, setEditorSeed] = useState(0);
	const [cachedImageFile, setCachedImageFile] = useState<File | null>(null);
	const [cachedImageUrl, setCachedImageUrl] = useState<string | null>(null);
	const [cachedImageDataUrl, setCachedImageDataUrl] = useState("");
	const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
	const [thumbnailPurpose, setThumbnailPurpose] = useState<
		ThumbnailPurpose | ""
	>("");
	const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState("");
	const [thumbnailDataUrl, setThumbnailDataUrl] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [saveMessage, setSaveMessage] = useState<string | null>(null);
	const [saveError, setSaveError] = useState<string | null>(null);
	const thumbnailInputRef = useRef<HTMLInputElement>(null);
	const hasLoadedRef = useRef(false);
	const saveDraftRef = useRef<() => void>(() => {});
	const { uploadState, uploadFile } = useFileUpload();

	useEffect(() => {
		const loadDraft = async () => {
			if (typeof window === "undefined") {
				return;
			}

			const rawDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);
			if (!rawDraft) {
				hasLoadedRef.current = true;
				return;
			}

			try {
				const parsed = JSON.parse(rawDraft) as LocalDraft;
				setPostType(parsed.postType || "project");
				setTitle(parsed.title || "");
				setSubtitle(parsed.subtitle || "");
				setSlug(parsed.slug || "");
				setSlugEdited(Boolean(parsed.slugEdited));
				setDate(parsed.date || "");
				setAuthor(parsed.author || "Nathan Yin");
				setDescription(parsed.description || "");
				setRepoUrl(parsed.repoUrl || "");
				setImagePath(parsed.imagePath || "");
				setModelPath(parsed.modelPath || "");
				setEditorContent(
					parsed.content || "<h3>Input Content Here!</h3>",
				);
				setEditorSeed((value) => value + 1);

				if (parsed.cachedImageDataUrl) {
					setCachedImageDataUrl(parsed.cachedImageDataUrl);
					setCachedImageUrl(parsed.cachedImageDataUrl);
					const reconstructedImage = await dataUrlToFile(
						parsed.cachedImageDataUrl,
						parsed.cachedImageName || "picture.webp",
						parsed.cachedImageType || "image/webp",
					);
					setCachedImageFile(reconstructedImage);
				}

				if (parsed.thumbnailDataUrl && parsed.thumbnailPurpose) {
					setThumbnailDataUrl(parsed.thumbnailDataUrl);
					setThumbnailPreviewUrl(parsed.thumbnailDataUrl);
					setThumbnailPurpose(parsed.thumbnailPurpose);
					const reconstructedThumbnail = await dataUrlToFile(
						parsed.thumbnailDataUrl,
						parsed.thumbnailName || "thumbnail",
						parsed.thumbnailType || "application/octet-stream",
					);
					setThumbnailFile(reconstructedThumbnail);
				}

				setSaveMessage("Loaded draft from local storage.");
			} catch {
				window.localStorage.removeItem(DRAFT_STORAGE_KEY);
			} finally {
				hasLoadedRef.current = true;
			}
		};

		void loadDraft();
	}, []);

	useEffect(() => {
		return () => {
			if (cachedImageUrl && cachedImageUrl.startsWith("blob:")) {
				URL.revokeObjectURL(cachedImageUrl);
			}
			if (
				thumbnailPreviewUrl &&
				thumbnailPreviewUrl.startsWith("blob:")
			) {
				URL.revokeObjectURL(thumbnailPreviewUrl);
			}
		};
	}, [cachedImageUrl, thumbnailPreviewUrl]);

	// Keep saveDraftRef pointing to the latest version of saveDraftLocally
	useEffect(() => {
		saveDraftRef.current = saveDraftLocally;
	});

	// Auto-save draft 1.5 s after any content change
	useEffect(() => {
		if (!hasLoadedRef.current) return;
		const timer = setTimeout(() => saveDraftRef.current(), 1500);
		return () => clearTimeout(timer);
	}, [
		postType,
		title,
		subtitle,
		slug,
		slugEdited,
		date,
		author,
		description,
		repoUrl,
		editorContent,
		imagePath,
		modelPath,
		cachedImageDataUrl,
		thumbnailDataUrl,
		thumbnailPurpose,
	]);

	const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setTitle(value);

		if (!slugEdited) {
			setSlug(toCamelSlug(value));
		}
	};

	const handleSlugChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSlug(sanitizeSlugInput(event.target.value));
		setSlugEdited(true);
	};

	const handleEditorImageCache = async (file: File) => {
		if (!file.type.startsWith("image/")) {
			return null;
		}

		if (cachedImageUrl) {
			URL.revokeObjectURL(cachedImageUrl);
		}

		const localUrl = URL.createObjectURL(file);
		const dataUrl = await fileToDataUrl(file);
		setCachedImageFile(file);
		setCachedImageUrl(localUrl);
		setCachedImageDataUrl(dataUrl);
		setSaveMessage("Image cached locally. It will upload on Publish.");
		setSaveError(null);
		return localUrl;
	};

	const handleThumbnailSelection = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const selected = event.target.files?.[0];
		if (!selected) {
			return;
		}

		const purpose = detectThumbnailPurpose(selected);
		if (!purpose) {
			setSaveError("Thumbnail must be an image or GLB/GLTF model file.");
			return;
		}

		if (thumbnailPreviewUrl && thumbnailPreviewUrl.startsWith("blob:")) {
			URL.revokeObjectURL(thumbnailPreviewUrl);
		}

		const preview =
			purpose === "thumbnail-image" ? URL.createObjectURL(selected) : "";
		const dataUrl = await fileToDataUrl(selected);

		setThumbnailFile(selected);
		setThumbnailPurpose(purpose);
		setThumbnailPreviewUrl(preview);
		setThumbnailDataUrl(dataUrl);
		setSaveError(null);
		setSaveMessage(
			purpose === "thumbnail-image"
				? "Thumbnail image cached locally. It will upload on Publish."
				: "Thumbnail model cached locally. It will upload on Publish.",
		);
	};

	const clearThumbnailCache = () => {
		if (thumbnailPreviewUrl && thumbnailPreviewUrl.startsWith("blob:")) {
			URL.revokeObjectURL(thumbnailPreviewUrl);
		}
		setThumbnailFile(null);
		setThumbnailPurpose("");
		setThumbnailPreviewUrl("");
		setThumbnailDataUrl("");
	};

	const saveDraftLocally = () => {
		if (typeof window === "undefined") {
			return;
		}

		let contentForDraft = editorContent;
		if (cachedImageUrl && cachedImageDataUrl) {
			contentForDraft = contentForDraft.replaceAll(
				cachedImageUrl,
				cachedImageDataUrl,
			);
		} else {
			contentForDraft = stripBlobImages(contentForDraft);
		}

		const draft: LocalDraft = {
			postType,
			title,
			subtitle,
			slug: sanitizeSlugInput(slug || toCamelSlug(title)),
			slugEdited,
			date,
			author,
			description,
			repoUrl,
			content: contentForDraft,
			imagePath,
			modelPath,
			cachedImageDataUrl,
			cachedImageName: cachedImageFile?.name || "",
			cachedImageType: cachedImageFile?.type || "",
			thumbnailDataUrl,
			thumbnailName: thumbnailFile?.name || "",
			thumbnailType: thumbnailFile?.type || "",
			thumbnailPurpose,
		};

		window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
		setSaveError(null);
		setSaveMessage("Draft saved in browser local storage.");
	};

	const publishPost = async () => {
		const normalizedSlug = sanitizeSlugInput(slug || toCamelSlug(title));
		if (!title.trim()) {
			setSaveError("Title is required");
			return;
		}
		if (!normalizedSlug) {
			setSaveError("Slug is required");
			return;
		}
		if (!editorContent.trim()) {
			setSaveError("Post content is empty");
			return;
		}

		setSaveError(null);
		setSaveMessage(null);
		setIsSaving(true);

		try {
			let contentToSave = editorContent;

			// Blog post: simpler publish (no thumbnail uploads)
			if (postType === "blog") {
				if (cachedImageFile) {
					const uploaded = await uploadFile(
						cachedImageFile,
						normalizedSlug,
					);
					if (!uploaded.success || !uploaded.fileUrl) {
						throw new Error(
							uploaded.error || "Failed to upload cached image",
						);
					}
					if (cachedImageUrl) {
						contentToSave = contentToSave.replaceAll(
							cachedImageUrl,
							uploaded.fileUrl,
						);
						if (cachedImageUrl.startsWith("blob:"))
							URL.revokeObjectURL(cachedImageUrl);
					}
					if (cachedImageDataUrl) {
						contentToSave = contentToSave.replaceAll(
							cachedImageDataUrl,
							uploaded.fileUrl,
						);
					}
					setCachedImageFile(null);
					setCachedImageUrl(null);
					setCachedImageDataUrl("");
				}

				const response = await fetch("/api/admin/blog-post", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...(adminSecret ? { Authorization: `Bearer ${adminSecret}` } : {}),
					},
					body: JSON.stringify({
						title: title.trim(),
						subtitle: subtitle.trim(),
						slug: normalizedSlug,
						date: date.trim(),
						content: contentToSave,
					}),
				});
				const result = await response.json();
				if (!response.ok)
					throw new Error(
						result.error || "Failed to publish blog post",
					);
				if (typeof window !== "undefined")
					window.localStorage.removeItem(DRAFT_STORAGE_KEY);
				setSlug(normalizedSlug);
				setSaveMessage("Blog post published. Local draft deleted.");
				setIsSaving(false);
				return;
			}

			let resolvedImagePath = imagePath.trim();
			let resolvedModelPath = modelPath.trim();

			if (cachedImageFile) {
				const uploaded = await uploadFile(
					cachedImageFile,
					normalizedSlug,
					undefined,
					adminSecret,
				);
				if (!uploaded.success || !uploaded.fileUrl) {
					throw new Error(
						uploaded.error || "Failed to upload cached image",
					);
				}
				resolvedImagePath = uploaded.fileUrl;
				if (cachedImageUrl) {
					contentToSave = contentToSave.replaceAll(
						cachedImageUrl,
						uploaded.fileUrl,
					);
					if (cachedImageUrl.startsWith("blob:")) {
						URL.revokeObjectURL(cachedImageUrl);
					}
				}
				if (cachedImageDataUrl) {
					contentToSave = contentToSave.replaceAll(
						cachedImageDataUrl,
						uploaded.fileUrl,
					);
				}
				setCachedImageFile(null);
				setCachedImageUrl(null);
				setCachedImageDataUrl("");
			}

			if (thumbnailFile && thumbnailPurpose) {
				const uploadedThumbnailUrl = await uploadAsset(
					thumbnailFile,
					normalizedSlug,
					thumbnailPurpose,
					adminSecret,
				);
				if (thumbnailPurpose === "thumbnail-image") {
					resolvedImagePath = uploadedThumbnailUrl;
					resolvedModelPath = "";
					setImagePath(uploadedThumbnailUrl);
					setModelPath("");
				} else {
					resolvedModelPath = uploadedThumbnailUrl;
					resolvedImagePath = "";
					setModelPath(uploadedThumbnailUrl);
					setImagePath("");
				}

				clearThumbnailCache();
			}

			const response = await fetch("/api/admin/project-post", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...(adminSecret ? { Authorization: `Bearer ${adminSecret}` } : {}),
				},
				body: JSON.stringify({
					title: title.trim(),
					slug: normalizedSlug,
					date: date.trim(),
					author: author.trim(),
					description: description.trim(),
					repoUrl: repoUrl.trim(),
					content: contentToSave,
					imagePath: resolvedImagePath,
					modelPath: resolvedModelPath,
				}),
			});

			const result = await response.json();
			if (!response.ok) {
				throw new Error(result.error || "Failed to publish post");
			}

			if (typeof window !== "undefined") {
				window.localStorage.removeItem(DRAFT_STORAGE_KEY);
			}
			setImagePath(resolvedImagePath);
			setModelPath(resolvedModelPath);
			setSlug(normalizedSlug);
			setSaveMessage("Published successfully. Local draft deleted.");
		} catch (error) {
			setSaveError(
				error instanceof Error ? error.message : "Save failed",
			);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="flex flex-col w-auto flex-1 pl-[20px] pr-[20px] md:pl-[15vw] md:pr-[15vw] bg-zinc-50 font-sans dark:bg-[#0a0a0a]">
			<div className="back-btn mt-10 w-fit h-fit">
				<h1 className="text-4xl md:text-5xl font-bold">Admin Panel</h1>
			</div>

			<div className="flex flex-col bg-mist-900 rounded-4xl p-5 w-full mt-10 transition-all">
				<button
					onClick={() =>
						expanded ? setExpanded(false) : setExpanded(true)
					}
				>
					<div className="header flex flex-rol justify-between items-center">
						<h2 className="text-xl md:text-2xl font-bold m-0 p-0">
							{postType === "project"
								? "Project Posts"
								: "Blog Posts"}
						</h2>

						<FaChevronDown></FaChevronDown>
					</div>
				</button>

				{expanded && (
					<div className="flex flex-col editor-area w-full h-auto mt-6">
						{/* Post type toggle */}
						<div className="flex gap-2 mb-5">
							<button
								type="button"
								onClick={() => setPostType("project")}
								className={`px-4 py-1.5 rounded-full font-medium text-sm transition-colors ${
									postType === "project"
										? "bg-blue-700 text-white"
										: "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
								}`}
							>
								Project Post
							</button>
							<button
								type="button"
								onClick={() => setPostType("blog")}
								className={`px-4 py-1.5 rounded-full font-medium text-sm transition-colors ${
									postType === "blog"
										? "bg-blue-700 text-white"
										: "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
								}`}
							>
								Blog Post
							</button>
						</div>
						<div className="flex flex-col mb-5 justify-between gap-5">
							<input
								placeholder="Title"
								value={title}
								onChange={handleTitleChange}
								className="border-3 rounded-2xl h-10 p-2 flex"
							></input>
							<input
								placeholder="Slug"
								value={slug}
								onChange={handleSlugChange}
								className="border-3 rounded-2xl h-10 p-2"
							></input>
							<input
								type="date"
								value={date}
								onChange={(event) =>
									setDate(event.target.value)
								}
								className="border-3 rounded-2xl h-10 p-2"
							></input>
							{postType === "blog" && (
								<input
									placeholder="Subtitle"
									value={subtitle}
									onChange={(event) =>
										setSubtitle(event.target.value)
									}
									className="border-3 rounded-2xl h-10 p-2"
								></input>
							)}
							{postType === "project" && (
								<>
									<input
										placeholder="Author (Default: Nathan Yin)"
										value={author}
										onChange={(event) =>
											setAuthor(event.target.value)
										}
										className="border-3 rounded-2xl p-2"
									></input>
									<input
										placeholder="Description"
										value={description}
										onChange={(event) =>
											setDescription(event.target.value)
										}
										className="border-3 rounded-2xl h-10 p-2 pt-5 pb-30"
									></input>
									<input
										placeholder="Repository URL (optional)"
										value={repoUrl}
										onChange={(event) =>
											setRepoUrl(event.target.value)
										}
										className="border-3 rounded-2xl h-10 p-2"
									></input>
									<input
										placeholder="imagePath (thumbnail image URL)"
										value={imagePath}
										onChange={(event) =>
											setImagePath(event.target.value)
										}
										className="border-3 rounded-2xl h-10 p-2"
									></input>
									<input
										placeholder="modelPath (thumbnail model URL)"
										value={modelPath}
										onChange={(event) =>
											setModelPath(event.target.value)
										}
										className="border-3 rounded-2xl h-10 p-2"
									></input>
									<div className="flex flex-col gap-2">
										<input
											type="file"
											accept="image/*,.glb,.gltf,model/gltf-binary,model/gltf+json"
											ref={thumbnailInputRef}
											onChange={(event) => {
												void handleThumbnailSelection(
													event,
												);
											}}
											className="hidden"
										/>
										<div className="flex flex-wrap items-center gap-3">
											<button
												type="button"
												onClick={() =>
													thumbnailInputRef.current?.click()
												}
												className="inline-block bg-cyan-700 hover:bg-cyan-600 p-2 pr-3 pl-3 rounded-full font-medium text-white"
											>
												Upload Thumbnail (Image / GLB)
											</button>
											{thumbnailFile && (
												<button
													type="button"
													onClick={
														clearThumbnailCache
													}
													className="inline-block bg-zinc-700 hover:bg-zinc-600 p-2 pr-3 pl-3 rounded-full font-medium text-white"
												>
													Clear Thumbnail Cache
												</button>
											)}
										</div>
										{thumbnailFile && (
											<p className="text-sm text-zinc-300">
												Cached thumbnail:{" "}
												{thumbnailFile.name} (
												{thumbnailPurpose})
											</p>
										)}
										{thumbnailPurpose ===
											"thumbnail-image" &&
											thumbnailPreviewUrl && (
												<img
													src={thumbnailPreviewUrl}
													alt="Thumbnail preview"
													className="w-48 h-auto rounded-xl border border-zinc-700"
												/>
											)}
									</div>
								</>
							)}
						</div>
						<div className="mb-3 text-sm text-zinc-300">
							Drop image files directly into the editor. Images
							are cached until Publish, then uploaded to
							<span className="font-semibold">
								{sanitizeSlugInput(
									slug || toCamelSlug(title),
								) || "yourSlug"}
								/picture.webp
							</span>
							.
						</div>
						<Tiptap
							key={editorSeed}
							onImageDropUpload={handleEditorImageCache}
							onContentChange={setEditorContent}
							initialContent={editorContent}
						></Tiptap>
						<div className="mt-3 min-h-6 text-sm">
							{uploadState.isUploading &&
								uploadState.progress && (
									<span className="text-zinc-300">
										Uploading cached image:{" "}
										{uploadState.progress.percentage}%
									</span>
								)}
							{cachedImageFile && !uploadState.isUploading && (
								<span className="text-amber-400">
									Image cached and waiting for Publish
								</span>
							)}
							{saveMessage && (
								<span className="text-green-400">
									{saveMessage}
								</span>
							)}
							{(saveError || uploadState.error) && (
								<span className="text-red-400">
									{saveError || uploadState.error}
								</span>
							)}
						</div>
						<div className="flex flex-row gap-5 mt-6">
							<button
								onClick={saveDraftLocally}
								disabled={isSaving || uploadState.isUploading}
								className="inline-block bg-green-700 hover:bg-green-600 disabled:opacity-50 p-2 pr-3 pl-3 rounded-full font-medium text-white"
							>
								Save Draft
							</button>
							<button
								onClick={() => void publishPost()}
								disabled={isSaving || uploadState.isUploading}
								className="inline-block bg-blue-700 hover:bg-blue-600 disabled:opacity-50 p-2 pr-3 pl-3 rounded-full font-medium text-white"
							>
								{isSaving ? "Publishing..." : "Publish"}
							</button>

							<button className="inline-block bg-red-700 hover:bg-red-600 p-2 pr-3 pl-3 rounded-full font-medium text-white">
								Delete
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

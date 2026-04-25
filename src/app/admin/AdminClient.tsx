"use client";

import Tiptap from "../components/TipTap";
import { useEffect, useRef, useState } from "react";
import { useFileUpload } from "@/src/hooks/useFileUpload";

import Link from "next/link";
// Icons
import { FaChevronDown } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";

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

interface CachedEditorImage {
	file: File;
	localUrl: string;
	dataUrl: string;
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
	const [focused, setFocused] = useState(false);
	const [expanded, setExpanded] = useState(true);
	const [showPopup, setShowPopup] = useState(false);
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
	const [cachedEditorImages, setCachedEditorImages] = useState<
		CachedEditorImage[]
	>([]);
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
	const popupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const { uploadState, uploadFile } = useFileUpload();

	const triggerSavedPopup = () => {
		setShowPopup(true);
		if (popupTimeoutRef.current) {
			clearTimeout(popupTimeoutRef.current);
		}
		popupTimeoutRef.current = setTimeout(() => {
			setShowPopup(false);
			popupTimeoutRef.current = null;
		}, 1000);
	};

	useEffect(() => {
		const keydownHandler = (e: any) => {
			// Quit fullscreen editor
			if (e.key === "Escape") {
				setFocused(false);
			}
			if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				saveDraftRef.current();
				triggerSavedPopup();
			}
		};
		document.addEventListener("keydown", keydownHandler);
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
					setCachedEditorImages([
						{
							file: reconstructedImage,
							localUrl: parsed.cachedImageDataUrl,
							dataUrl: parsed.cachedImageDataUrl,
						},
					]);
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

		return () => {
			document.removeEventListener("keydown", keydownHandler);
			if (popupTimeoutRef.current) {
				clearTimeout(popupTimeoutRef.current);
			}
		};
	}, []);

	useEffect(() => {
		return () => {
			const urls = new Set<string>();
			for (const image of cachedEditorImages) {
				urls.add(image.localUrl);
			}
			if (cachedImageUrl) {
				urls.add(cachedImageUrl);
			}
			for (const url of urls) {
				if (url.startsWith("blob:")) {
					URL.revokeObjectURL(url);
				}
			}
			if (
				thumbnailPreviewUrl &&
				thumbnailPreviewUrl.startsWith("blob:")
			) {
				URL.revokeObjectURL(thumbnailPreviewUrl);
			}
		};
	}, [cachedEditorImages, cachedImageUrl, thumbnailPreviewUrl]);

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

		const localUrl = URL.createObjectURL(file);
		const dataUrl = await fileToDataUrl(file);
		setCachedEditorImages((prev) => [...prev, { file, localUrl, dataUrl }]);
		setCachedImageFile(file);
		setCachedImageUrl(localUrl);
		setCachedImageDataUrl(dataUrl);
		setSaveMessage(
			"Image cached locally. All dropped images will upload on Publish.",
		);
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
		if (cachedEditorImages.length > 0) {
			for (const image of cachedEditorImages) {
				contentForDraft = contentForDraft.replaceAll(
					image.localUrl,
					image.dataUrl,
				);
			}
		} else if (cachedImageUrl && cachedImageDataUrl) {
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

	const uploadCachedEditorImages = async (
		content: string,
		normalizedSlug: string,
	) => {
		let nextContent = content;
		const queuedImages =
			cachedEditorImages.length > 0
				? cachedEditorImages
				: cachedImageFile && cachedImageUrl && cachedImageDataUrl
					? [
							{
								file: cachedImageFile,
								localUrl: cachedImageUrl,
								dataUrl: cachedImageDataUrl,
							},
						]
					: [];

		for (const image of queuedImages) {
			const uploaded = await uploadFile(
				image.file,
				normalizedSlug,
				undefined,
				adminSecret,
			);
			if (!uploaded.success || !uploaded.fileUrl) {
				throw new Error(
					uploaded.error || "Failed to upload cached image",
				);
			}

			nextContent = nextContent.replaceAll(
				image.localUrl,
				uploaded.fileUrl,
			);
			nextContent = nextContent.replaceAll(
				image.dataUrl,
				uploaded.fileUrl,
			);
		}

		for (const image of queuedImages) {
			if (image.localUrl.startsWith("blob:")) {
				URL.revokeObjectURL(image.localUrl);
			}
		}

		setCachedEditorImages([]);
		setCachedImageFile(null);
		setCachedImageUrl(null);
		setCachedImageDataUrl("");

		return nextContent;
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
				contentToSave = await uploadCachedEditorImages(
					contentToSave,
					normalizedSlug,
				);

				const response = await fetch("/api/admin/blog-post", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...(adminSecret
							? { Authorization: `Bearer ${adminSecret}` }
							: {}),
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
			contentToSave = await uploadCachedEditorImages(
				contentToSave,
				normalizedSlug,
			);

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
					...(adminSecret
						? { Authorization: `Bearer ${adminSecret}` }
						: {}),
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
			{/* Saved popup */}

			<div
				className={
					showPopup
						? "fixed self-center pt-2 pb-2 pl-5 pr-5 rounded-full bg-green-600 text-white bottom-10 z-1000 transition-all ease-in-out"
						: "fixed self-center pt-2 pb-2 pl-5 pr-5 rounded-full bg-green-600 text-white -bottom-10 z-1000 transition-all ease-in-out"
				}
			>
				<p className="">✅ Saved!</p>
			</div>

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
								className="border-3 rounded-2xl h-10 p-2 flex border-mist-700"
							></input>
							<input
								placeholder="Slug"
								value={slug}
								onChange={handleSlugChange}
								className="border-3 rounded-2xl h-10 p-2 border-mist-700"
							></input>
							<input
								type="date"
								value={date}
								onChange={(event) =>
									setDate(event.target.value)
								}
								className="border-3 rounded-2xl h-10 p-2 border-mist-700"
							></input>
							{postType === "blog" && (
								<input
									placeholder="Subtitle"
									value={subtitle}
									onChange={(event) =>
										setSubtitle(event.target.value)
									}
									className="border-3 rounded-2xl h-10 p-2 border-mist-700"
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
										className="border-3 rounded-2xl p-2 border-mist-700"
									></input>
									<input
										placeholder="Description"
										value={description}
										onChange={(event) =>
											setDescription(event.target.value)
										}
										className="border-3 rounded-2xl h-10 p-2 pt-5 pb-30 border-mist-700"
									></input>
									<input
										placeholder="Repository URL (optional)"
										value={repoUrl}
										onChange={(event) =>
											setRepoUrl(event.target.value)
										}
										className="border-3 rounded-2xl h-10 p-2 border-mist-700"
									></input>
									<input
										placeholder="imagePath (thumbnail image URL)"
										value={imagePath}
										onChange={(event) =>
											setImagePath(event.target.value)
										}
										className="border-3 rounded-2xl h-10 p-2 border-mist-700"
									></input>
									<input
										placeholder="modelPath (thumbnail model URL)"
										value={modelPath}
										onChange={(event) =>
											setModelPath(event.target.value)
										}
										className="border-3 rounded-2xl h-10 p-2 border-mist-700"
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
											className="hidden border-mist-700"
										/>
										<div className="flex flex-wrap items-center gap-3">
											<button
												type="button"
												onClick={() =>
													thumbnailInputRef.current?.click()
												}
												className="inline-block bg-blue-800 hover:bg-blue-700 p-2 pr-3 pl-3 rounded-full font-medium text-white"
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
							are cached until Publish, then uploaded to{" "}
							<span className="font-semibold">
								{sanitizeSlugInput(
									slug || toCamelSlug(title),
								) || "yourSlug"}
								/images/*.webp
							</span>
							.
						</div>
						<div
							className={
								focused
									? "fixed inset-0 bg-black opacity-80 w-full h-full z-998"
									: ""
							}
						></div>
						<div
							className={
								focused
									? "fixed z-999 bg-mist-950 w-full h-full self-center top-0 overflow-y-scroll border-2 border-orange-400 rounded-2xl pl-[30px] pr-[30px] xl:pl-[25vw] xl:pr-[25vw]"
									: "border-3 border-white rounded-2xl p-2"
							}
						>
							{focused && (
								<div className="mt-10">
									<button
										onClick={() => setFocused(false)}
										className="inline-flex items-center justify-center shrink-0"
									>
										<FontAwesomeIcon
											icon={faCircleArrowLeft}
											className="w-6 h-6 hover:text-gray-400 transition-colors duration-200 cursor-pointer"
											size="xl"
										/>
									</button>
									<div className="pt-[100px]">
										<h1 className="title text-3xl xl:text-5xl font-bold mb-1.5">
											{title}
										</h1>
										<h2 className="date xl:text-xl font-bold">
											{date} • {author}
										</h2>
										<div className="bg-gray-500 w-full h-[1px] mt-3 mb-5"></div>
									</div>
								</div>
							)}

							<Tiptap
								key={editorSeed}
								onImageDropUpload={handleEditorImageCache}
								onContentChange={setEditorContent}
								initialContent={editorContent}
								onFocus={() => setFocused(true)}
							></Tiptap>
						</div>
						<div className="mt-3 min-h-6 text-sm">
							{uploadState.isUploading &&
								uploadState.progress && (
									<span className="text-zinc-300">
										Uploading cached image:{" "}
										{uploadState.progress.percentage}%
									</span>
								)}
							{cachedEditorImages.length > 0 &&
								!uploadState.isUploading && (
									<span className="text-amber-400">
										{cachedEditorImages.length} image(s)
										cached and waiting for Publish
									</span>
								)}
							{saveMessage &&
								cachedEditorImages.length > 0 &&
								!uploadState.isUploading && (
									<span className="block"> </span>
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

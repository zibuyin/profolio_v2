import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import TurndownService from "turndown";
import { runPostPublish } from "@/src/lib/run-post-publish";

interface SavePayload {
	title: string;
	slug: string;
	date: string;
	author: string;
	description: string;
	repoUrl?: string;
	content: string;
	imagePath?: string;
	modelPath?: string;
}

export const runtime = "nodejs";

const turndown = new TurndownService({
	headingStyle: "atx",
	codeBlockStyle: "fenced",
	bulletListMarker: "-",
});

function normalizeToMarkdown(content: string) {
	const trimmed = content.trim();
	if (!trimmed) {
		return "";
	}

	const hasHtml = /<\/?[a-z][\s\S]*>/i.test(trimmed);
	if (!hasHtml) {
		return trimmed;
	}

	return turndown.turndown(trimmed).trim();
}

function isValidSlug(slug: string) {
	return /^[a-zA-Z0-9]+$/.test(slug);
}

function formatDate(raw: string): string {
	// Accept YYYY-MM-DD (from <input type="date">) or already-formatted strings
	const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
	if (isoMatch) {
		const [, year, month, day] = isoMatch;
		// Use UTC to avoid timezone shifting the day
		const d = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
		return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
	}
	// Already formatted or unknown — return as-is
	return raw.trim();
}

export async function POST(request: NextRequest) {
	try {
		const adminSecret = process.env.ADMIN_SECRET;
		if (adminSecret) {
			const authHeader = request.headers.get("Authorization");
			const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
			if (token !== adminSecret) {
				return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
			}
		}

		const payload = (await request.json()) as SavePayload;

		const slug = (payload.slug || "").trim();
		if (!isValidSlug(slug)) {
			return NextResponse.json(
				{ error: "Slug must contain only letters and numbers" },
				{ status: 400 },
			);
		}

		const bodyContent = normalizeToMarkdown(payload.content || "");
		if (!bodyContent) {
			return NextResponse.json(
				{ error: "Post content cannot be empty" },
				{ status: 400 },
			);
		}

		const frontmatter = {
			title: payload.title || "Untitled",
			description: payload.description || "",
			date: formatDate(payload.date || new Date().toISOString().slice(0, 10)),
			author: payload.author || "Nathan Yin",
			slug,
			imagePath: payload.imagePath || "",
			modelPath: payload.modelPath || "",
			repoUrl: payload.repoUrl || "",
		};

		const fileContent = matter.stringify(bodyContent, frontmatter);
		const targetDir = path.resolve(process.cwd(), "content/project/md");
		const targetPath = path.resolve(targetDir, `${slug}.mdx`);

		await fs.mkdir(targetDir, { recursive: true });
		await fs.writeFile(targetPath, fileContent, "utf8");
		await runPostPublish({
			filePath: targetPath,
			postType: "project",
			slug,
		});

		return NextResponse.json({
			success: true,
			slug,
			path: targetPath,
		});
	} catch (error) {
		console.error("Failed to save project post:", error);
		return NextResponse.json(
			{ error: "Failed to save project post" },
			{ status: 500 },
		);
	}
}

"use client";

import { useEffect, useMemo, useState } from "react";

interface StatusResponse {
	status:
		| "operational"
		| "degraded"
		| "partial"
		| "major"
		| "maintenance"
		| "error"
		| "unknown";
	label: string;
	updatedAt: string | null;
}

export default function SystemStatus() {
	const statusPageUrl = "https://status.nathanyin.com";

	const [data, setData] = useState<StatusResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [refreshKey, setRefreshKey] = useState(Date.now());

	// =========================
	// Fetch status (DEV + PROD same)
	// =========================
	const fetchData = async () => {
		setLoading(true);
		setError(false);

		try {
			const res = await fetch(`/api/status?t=${refreshKey}`);
			if (!res.ok) throw new Error("Request failed");

			const json = await res.json();
			setData(json);
		} catch (e) {
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	// initial + refresh fetch
	useEffect(() => {
		fetchData();
	}, [refreshKey]);

	// optional auto refresh (like real status pages)
	useEffect(() => {
		const id = setInterval(() => {
			setRefreshKey(Date.now());
		}, 30000);

		return () => clearInterval(id);
	}, []);

	// =========================
	// derived state
	// =========================
	const status = useMemo(() => {
		if (error) return "error";
		return data?.status || "unknown";
	}, [data, error]);

	const label = data?.label || "Unknown";

	// =========================
	// styling map
	// =========================
	const statusColor = {
		operational: "text-green-500 bg-green-500/10",
		degraded: "text-yellow-500 bg-yellow-500/10",
		partial: "text-yellow-500 bg-yellow-500/10",
		major: "text-red-500 bg-red-500/10",
		maintenance: "text-blue-500 bg-blue-500/10",
		error: "text-gray-400 bg-gray-500/10",
		unknown: "text-gray-400 bg-gray-500/10",
	}[status];

	const handleRefresh = () => {
		setRefreshKey(Date.now());
	};

	const Wrapper = statusPageUrl ? "a" : "div";

	return (
		<Wrapper
			href={statusPageUrl || undefined}
			target={statusPageUrl ? "_blank" : undefined}
			rel={statusPageUrl ? "noopener noreferrer" : undefined}
			onClick={!statusPageUrl ? handleRefresh : undefined}
			className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full
        text-sm cursor-pointer select-none
        transition-all duration-300
        hover:-translate-y-0.5 active:translate-y-0
        ${statusColor}
      `}
			title={
				statusPageUrl ? `View status - ${label}` : "Click to refresh"
			}
		>
			{/* status dot */}
			<div className="relative flex items-center justify-center w-2 h-2">
				{/* ping animation */}
				{!loading && (
					<span
						className={`
              absolute w-2 h-2 rounded-full animate-ping
              ${
					status === "operational"
						? "bg-green-500"
						: status === "degraded"
							? "bg-yellow-500"
							: status === "partial"
								? "bg-yellow-500"
								: status === "major"
									? "bg-red-500"
									: status === "maintenance"
										? "bg-blue-500"
										: "bg-gray-400"
				}
            `}
					/>
				)}

				{/* core dot */}
				<span
					className={`
            w-2 h-2 rounded-full
            ${loading ? "bg-gray-400 animate-pulse" : ""}
            ${
				status === "operational"
					? "bg-green-500"
					: status === "degraded"
						? "bg-yellow-500"
						: status === "partial"
							? "bg-yellow-500"
							: status === "major"
								? "bg-red-500"
								: status === "maintenance"
									? "bg-blue-500"
									: "bg-gray-400"
			}
          `}
				/>
			</div>

			{/* label */}
			<span className="font-medium">
				{loading ? "Checking..." : label}
			</span>
		</Wrapper>
	);
}

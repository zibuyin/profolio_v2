"use client";
import { useState, useEffect } from "react";

export default function Gallery() {
	const [imageList, setImageList] = useState<string[]>([]);

	// Fetch images on mount
	useEffect(() => {
		fetch("/api/gallery")
			.then((res) => res.json())
			.then((data) => setImageList(data));
	}, []);

	return <h1>{JSON.stringify(imageList)}</h1>;
}

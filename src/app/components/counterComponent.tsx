"use client";
import { useState, useEffect } from "react";
// import { Counter } from "counterapi";

// const apiKey = process.env.COUNTER_API_KEY;

function getCookie(cname: string) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == " ") {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

export default function CounterModule() {
	const [isUnique, setIsUnique] = useState<boolean>(false);

	useEffect(() => {
		if (getCookie("Visited")) {
			// Already visited
			console.log("Old visitor");
		} else {
			// New visitor => set flag
			console.log("New visitor");
		}
	});

	if (isUnique) {
	}

	return <></>;
}

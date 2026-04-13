import { NextResponse } from "next/server";

export async function GET() {
	return NextResponse.json({ message: "ok" });
}

export async function POST() {
	return NextResponse.json({ message: "POST received" });
}


// const counter = new Counter({
// 	workspace: "nathan-yins-team",
// 	debug: true,
// 	timeout: 5000,
// 	accessToken: apiKey,
// });
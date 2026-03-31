import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
	const cookieStore = await cookies();
	return NextResponse.json({ message: cookieStore });
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
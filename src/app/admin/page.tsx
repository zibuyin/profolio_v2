import AdminClient from "./AdminClient";

// Server component — reads the secret from env and passes it to the client.
// This page is gated by Cloudflare Access, so the token only reaches
// authenticated users. API routes independently verify the same secret.
export default function AdminPage() {
	const adminSecret = process.env.ADMIN_SECRET ?? "";
	return <AdminClient adminSecret={adminSecret} />;
}

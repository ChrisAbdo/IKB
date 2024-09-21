// app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <div>
      <h1>Welcome to Our App</h1>
      <p>This is the landing page for unauthenticated users.</p>
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
    </div>
  );
}

import Link from "next/link";

export default function Header() {
  return (
    <header className="navbar bg-base-100 shadow mb-8">
      <div className="container mx-auto flex justify-between items-center py-4 px-2">
        <Link href="/" className="text-2xl font-bold text-primary">
          PhotoMeh
        </Link>
        <nav className="flex gap-6 items-center">
          <Link href="/login" className="btn btn-primary btn-sm ml-4">
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}

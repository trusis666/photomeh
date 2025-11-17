export default function Footer() {
  return (
    <footer className="footer footer-center p-6 bg-base-200 text-base-content mt-12">
      <nav className="flex gap-6">
        <a href="/privacy-policy" className="link link-hover">
          Privacy Policy
        </a>
        <a href="/terms-and-conditions" className="link link-hover">
          Terms & Conditions
        </a>
      </nav>
      <p className="mt-2 text-sm text-gray-500">
        © {new Date().getFullYear()} PhotoMeh. All rights reserved.
      </p>
    </footer>
  );
}

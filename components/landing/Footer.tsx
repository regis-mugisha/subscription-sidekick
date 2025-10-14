import Link from "next/link";

export function Footer() {
  return (
    <footer className="container mx-auto px-4 py-10 text-sm text-muted-foreground">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>© {new Date().getFullYear()} Subscription Sidekick</div>
        <nav className="flex items-center gap-6">
          <Link href="#" className="hover:text-foreground">
            Terms
          </Link>
          <Link href="#" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="#" className="hover:text-foreground">
            Contact
          </Link>
          <a href="#" className="hover:text-foreground">
            Twitter
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;

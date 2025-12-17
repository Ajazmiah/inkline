import React from "react";
import Logo from "../Logo/Logo";

function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Top section */}
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <Logo />

          {/* Footer links (optional / expandable) */}
          <div className="flex gap-6 text-sm text-black/70">
            <a
              href="#"
              className="transition hover:text-black"
            >
              Privacy
            </a>
            <a
              href="#"
              className="transition hover:text-black"
            >
              Terms
            </a>
            <a
              href="#"
              className="transition hover:text-black"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-10 flex flex-col gap-2 border-t border-black/10 pt-6 text-sm text-black/60 md:flex-row md:items-center md:justify-between">
          <p>
            Created by{" "}
            <a
              href="https://ajazmiah.info/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-black transition hover:underline"
            >
              Ajaz Miah
            </a>
          </p>

          <p>&copy; 2024 Inkline.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

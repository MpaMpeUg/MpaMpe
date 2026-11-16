import {
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/submission-forms";

const explore = [
  ["/campaigns", "Explore campaigns"],
  ["/start", "Start a campaign"],
  ["/how-it-works", "How it works"],
  ["/impact", "Our impact"],
  ["/stories", "Stories & updates"],
];

const community = [
  ["/mxm", "MpaMpe Xmas Mission"],
  ["/mavericks", "MpaMpe Mavericks"],
  ["/partners", "Partner with us"],
  ["/events", "Events"],
  ["/about", "About MpaMpe"],
  ["/contact", "Contact & support"],
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-newsletter">
        <div>
          <span className="eyebrow eyebrow-light">Email updates</span>
          <h2>Receive campaign, event and volunteer notices.</h2>
        </div>
        <NewsletterForm />
      </div>
      <div className="container footer-grid">
        <div className="footer-about">
          <Image
            src="/images/logo.png"
            alt="MpaMpe"
            width={202}
            height={40}
          />
          <p>Crowdfunding for reviewed campaigns in Uganda.</p>
          <div className="social-links" aria-label="MpaMpe social links">
            <a
              href="https://www.linkedin.com/in/mpampe-uganda-804414222/"
              aria-label="LinkedIn"
            >
              <Linkedin />
            </a>
            <a
              href="https://www.instagram.com/mpampeug/"
              aria-label="Instagram"
            >
              <Instagram />
            </a>
            <a
              href="https://www.youtube.com/channel/UC8gsxBsDvO5xN5ZCHRrUIxw"
              aria-label="YouTube"
            >
              <Youtube />
            </a>
          </div>
        </div>
        <FooterLinks title="Explore" links={explore} />
        <FooterLinks title="Community" links={community} />
        <div>
          <h3>Contact</h3>
          <ul className="footer-contact">
            <li>
              <Mail />
              <a href="mailto:info@mpampe.com">info@mpampe.com</a>
            </li>
            <li>
              <Phone />
              <a href="tel:+256757163101">+256 757 163 101</a>
            </li>
            <li>
              <MapPin />
              <span>Kampala, Uganda</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} MpaMpe. All rights reserved.</p>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/refunds">Refunds</Link>
          <Link href="/trust-and-safety">Trust & safety</Link>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: string[][];
}) {
  return (
    <div>
      <h3>{title}</h3>
      <ul className="footer-links">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

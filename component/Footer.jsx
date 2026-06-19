import { Facebook, Headphones, Instagram, Lock, RotateCcw, ShieldCheck, Truck, Youtube } from "lucide-react";

const columns = [
  {
    title: "Maison",
    links: [
      { name: "About FAVEE", url: "/about" }
    ],
  },
  {
    title: "Collections",
    links: [
      { name: "All Collections", url: "/collection" },
      { name: "New Arrivals", url: "/new-arrival" }
    ],
  },
  {
    title: "Client Care",
    links: [
      { name: "Contact Us", url: "/contact" },
      { name: "Track Order", url: "/track-order" },
      { name: "Shipping Policy", url: "/shipping-delivery-policy" },
      { name: "Returns & Refunds", url: "/return-refund-policy" }
    ],
  },
];

const trustItems = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Across India",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Within 7 days",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "Encrypted checkout",
  },
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    description: "Guaranteed authentic",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Atelier concierge",
  },
];

export function Footer() {
  return (
    <div>
      <section className="border-b border-white/10 bg-[#723328]">
        <div className="w-full px-6 py-8 lg:px-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
            {trustItems.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="flex items-start gap-3 text-white">
                  <div className="mt-0.5 text-gold/90">
                    <Icon className="h-7 w-7 stroke-[1.5]" />
                  </div>
                  <div>
                    <p className="font-serif text-[17px] leading-none">{item.title}</p>
                    <p className="mt-1 text-[13px] leading-tight text-white/65">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="bg-[#723328] text-white">
        <div className="w-full px-6 py-20 lg:px-12">
        {/* Newsletter */}
        <div className="border-b border-(--gold)/25 pb-16 text-center">
          <p className="eyebrow text-gold">The Maison Letter</p>
          <h3 className="mt-5 font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
            Join the <span className="font-script text-gold">House</span> of FAVEE
          </h3>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/70">
            Become part of a community that celebrates elegance, heritage, and timeless fashion. Private previews, atelier stories and invitations to FAVEE events.
          </p>
          <form className="mx-auto mt-8 flex max-w-lg gap-0 border-b border-(--gold)/50">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent px-2 py-4 text-sm placeholder:text-white/40 focus:outline-none"
            />
            <button className="eyebrow text-gold px-5 text-[10px] tracking-[0.32em] hover:text-white">
              Subscribe
            </button>
          </form>
        </div>

        <div className="grid gap-12 py-14 md:grid-cols-4">
          <div>
            <a href="/" className="font-serif text-3xl tracking-[0.35em] text-white">
              FAVEE
            </a>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              A luxury ethnic fashion house celebrating royal Indian heritage and the modern woman.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" aria-label="Instagram" className="text-gold transition-colors hover:text-white">
                <Instagram className="h-4 w-4" strokeWidth={1.25} />
              </a>
              <a href="#" aria-label="Facebook" className="text-gold transition-colors hover:text-white">
                <Facebook className="h-4 w-4" strokeWidth={1.25} />
              </a>
              <a href="#" aria-label="YouTube" className="text-gold transition-colors hover:text-white">
                <Youtube className="h-4 w-4" strokeWidth={1.25} />
              </a>
            </div>
          </div>

          {columns.map((c) => (
            <div key={c.title}>
              <p className="eyebrow text-gold">{c.title}</p>
              <ul className="mt-5 space-y-3">
                {c.links.map((l) => (
                  <li key={l.name}>
                    <a
                      href={l.url}
                      className="text-sm text-white/75 transition-colors hover:text-gold"
                    >
                      {l.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-(--gold)/20 pt-8 text-xs text-white/55 md:flex-row">
          <p>© {new Date().getFullYear()} FAVEE Maison. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy-policy" className="hover:text-gold">Privacy</a>
            <a href="/terms-of-service" className="hover:text-gold">Terms</a>
            <a href="/cookie-policy" className="hover:text-gold">Cookies</a>
          </div>
          <p className="font-script italic text-gold">Made to be remembered.</p>
        </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;

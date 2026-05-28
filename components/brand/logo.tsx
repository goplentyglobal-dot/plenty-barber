import Link from "next/link";

export function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Plenty Barber home">
      <span className="grid h-10 w-10 place-items-center rounded-md border border-gold/45 bg-gold/10 font-display text-lg font-semibold text-gold">
        PB
      </span>
      <span className="leading-none">
        <span className="block font-display text-lg text-cream">Plenty Barber</span>
        <span className="block text-xs uppercase text-gold-light/70">
          GoPlenty Global
        </span>
      </span>
    </Link>
  );
}

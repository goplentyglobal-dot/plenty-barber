import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Crown, FileText, ShieldCheck, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n/server";

export default function HomePage() {
  const dictionary = getDictionary();
  const landing = dictionary.landing;

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="relative min-h-[76svh] overflow-hidden border-b border-white/10">
        <Image
          src="/images/plenty-barber-hero-report-mockup.png"
          alt="Plenty Barber visagism report dashboard preview"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.92)_0%,rgba(10,10,10,0.76)_34%,rgba(10,10,10,0.2)_72%,rgba(10,10,10,0.62)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-noir to-transparent" />

        <div className="relative mx-auto flex min-h-[76svh] max-w-7xl items-end px-5 py-12 md:items-center md:py-16">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-gold/25 bg-noir/65 px-4 py-2 text-xs uppercase text-gold-light backdrop-blur">
              <Crown className="h-4 w-4" />
              {landing.badge}
            </p>
            <h1 className="font-display text-5xl leading-tight text-cream md:text-7xl">
              Plenty Barber
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-cream/78">
              {landing.subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup">
                <Button className="w-full gap-2 sm:w-auto">
                  {landing.primaryCta} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full bg-noir/35 backdrop-blur sm:w-auto">
                  {landing.secondaryCta}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-noir-soft/60 py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-4">
          {landing.benefits.map((benefit) => (
            <div key={benefit} className="flex gap-3 text-sm leading-6 text-cream/76">
              <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-gold" />
              {benefit}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="max-w-2xl">
          <p className="text-sm uppercase text-gold-light">{landing.howItWorks}</p>
          <h2 className="mt-3 font-display text-4xl text-cream">{landing.workflowTitle}</h2>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {landing.steps.map((step, index) => (
            <Card key={step.title}>
              <span className="text-sm text-gold-light">0{index + 1}</span>
              <h3 className="mt-5 font-display text-2xl text-cream">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-cream/62">{step.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-20 md:grid-cols-3">
        <Card>
          <Sparkles className="h-7 w-7 text-gold" />
          <h3 className="mt-5 font-display text-2xl">{landing.cards[0].title}</h3>
          <p className="mt-3 text-sm leading-6 text-cream/62">{landing.cards[0].text}</p>
        </Card>
        <Card>
          <FileText className="h-7 w-7 text-gold" />
          <h3 className="mt-5 font-display text-2xl">{landing.cards[1].title}</h3>
          <p className="mt-3 text-sm leading-6 text-cream/62">{landing.cards[1].text}</p>
        </Card>
        <Card>
          <ShieldCheck className="h-7 w-7 text-gold" />
          <h3 className="mt-5 font-display text-2xl">{landing.cards[2].title}</h3>
          <p className="mt-3 text-sm leading-6 text-cream/62">{landing.cards[2].text}</p>
        </Card>
      </section>
    </main>
  );
}

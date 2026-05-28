import type { ReactNode } from "react";

type PageHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeading({ eyebrow, title, description, action }: PageHeadingProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(201,168,76,0.10),rgba(255,255,255,0.025))] p-5 md:p-6">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-xs uppercase text-gold-light/72">{eyebrow}</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-cream md:text-5xl">{title}</h1>
          {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-cream/58">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}

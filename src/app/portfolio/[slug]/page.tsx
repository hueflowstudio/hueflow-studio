import Link from "next/link";
import { notFound } from "next/navigation";
import { PORTFOLIO_ITEMS } from "@/app/data/portfolio";

type Props = { params: Promise<{ slug: string }> };

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = PORTFOLIO_ITEMS.find((item) => item.slug === slug);
  if (!project) notFound();

  const images =
    slug === "study-cafe"
      ? ["/images/study-cafe.png", "/images/study-cafe-2.png", "/images/study-cafe-3.png", "/images/study-cafe-4.png"]
      : [project.image];

  const studyCafeInfo = [
    { label: "DESCRIPTION", value: "Study Cafe Renewal" },
    { label: "INTERIOR SURFACE", value: "180㎡" },
    { label: "FINISHING", value: "Floor — Hardwood / Wall — Paint / Ceiling — Paint" },
    { label: "LOCATION", value: "Seoul, Korea" },
    { label: "DATE OF COMPLETION", value: "March, 2026" },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F2EBE3] text-[#2C1810]">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <Link
          href="/#portfolio"
          className="font-accent mb-10 inline-block text-xs uppercase tracking-[0.2em] text-[#2C1810]/70 transition hover:text-[#2C1810]"
        >
          ← BACK
        </Link>

        <p className="font-accent mb-2 text-xs uppercase tracking-[0.2em] text-[#C9A96E]">
          {project.category}
        </p>
        <h1 className="font-display text-4xl font-light tracking-tight text-[#2C1810] sm:text-5xl">
          {project.title}
        </h1>

        <div className="mt-14 flex gap-10">
          <aside
            className="w-[220px] shrink-0 self-start font-accent"
            style={{ position: "sticky", top: "100px" }}
          >
            {slug === "study-cafe" ? (
              <div>
                {studyCafeInfo.map(({ label, value }) => (
                  <div key={label} className="mb-4 last:mb-0">
                    <p
                      className="text-[9px] uppercase tracking-[0.1em] text-[#9E8E82]"
                      style={{ marginBottom: "16px" }}
                    >
                      {label}
                    </p>
                    <p className="text-[11px] font-light leading-relaxed text-[#5C3420]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-4 last:mb-0">
                <p
                  className="text-[9px] uppercase tracking-[0.1em] text-[#9E8E82]"
                  style={{ marginBottom: "16px" }}
                >
                  PROJECT
                </p>
                <p className="text-[11px] font-light leading-relaxed text-[#5C3420]">
                  {project.title}
                </p>
              </div>
            )}
          </aside>

          <div
            className="min-w-0 flex-1 grid gap-1"
            style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "4px" }}
          >
            {images.map((src, i) => (
              <div key={i} className="aspect-[4/3] overflow-hidden">
                <img
                  src={src}
                  alt={`${project.title} ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

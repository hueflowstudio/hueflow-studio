"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import HeroSection from "./HeroSection";
import { PORTFOLIO_ITEMS } from "./data/portfolio";

function useInView(threshold = 0.05) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold, rootMargin: "0px 0px -20px 0px" }
    );
    obs.observe(el);
    const checkVisible = () => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight - 20 && rect.bottom > 20;
      if (inView) setIsVisible(true);
    };
    checkVisible();
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, isVisible] as const;
}

const SERVICES = [
  { title: "설계협업", desc: "건축·인테리어 설계 전 과정을 함께합니다. 공간 분석부터 시공까지 원스톱 협업을 제공합니다.", icon: "⌐" },
  { title: "AI 인테리어 스타일링", desc: "AI 기반 스타일 제안으로 공간의 무한한 가능성을 먼저 경험해 보세요.", icon: "◇" },
  { title: "AI 강의", desc: "인테리어와 AI 활용을 결합한 실무 강의 및 워크숍을 진행합니다.", icon: "◈" },
];

const LECTURES = [
  { title: "인테리어 기초와 공간 읽기", desc: "공간을 이해하고 나만의 스타일을 찾는 4주 과정" },
  { title: "AI로 완성하는 인테리어 콘셉트", desc: "AI 도구를 활용한 컨셉 도출과 시각화 실습" },
  { title: "실무 인테리어 디자인 워크숍", desc: "실제 프로젝트 기반 설계·발표·피드백" },
];

const STYLE_OPTIONS = [
  { id: "minimal", label: "미니멀" },
  { id: "modern", label: "모던" },
  { id: "natural", label: "내추럴" },
  { id: "industrial", label: "인더스트리얼" },
  { id: "classic", label: "클래식" },
];

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [portfolioRef, portfolioVisible] = useInView();
  const [servicesRef, servicesVisible] = useInView();
  const [aiRef, aiVisible] = useInView();
  const [lecturesRef, lecturesVisible] = useInView();
  const [contactRef, contactVisible] = useInView();

  const fadeStyle = (visible: boolean, delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(30px)",
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.");
    setContactForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-[#F0EDE8] text-[#2C1810]">
      <HeroSection />

      {/* 3. Portfolio - AVEC style */}
      <section id="portfolio" className="scroll-mt-20 border-t border-[#2C1810]/10 py-28 px-6">
        <div ref={portfolioRef} className="mx-auto max-w-6xl" style={fadeStyle(portfolioVisible)}>
          <p className="font-accent mb-3 text-xs uppercase tracking-[0.25em] text-[#C9A96E]">
            Portfolio
          </p>
          <h2 className="font-display mb-20 text-3xl font-light tracking-tight text-[#2C1810] sm:text-4xl">
            프로젝트
          </h2>
          <div className="grid grid-cols-2 gap-0">
            {PORTFOLIO_ITEMS.map((item, index) => (
              <Link
                key={item.id}
                href={`/portfolio/${item.slug}`}
                className="group relative block overflow-hidden"
                style={fadeStyle(portfolioVisible, 0.1 * index)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-[transform] duration-[400ms] ease-out group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-6 opacity-0 transition-opacity duration-[400ms] ease-out group-hover:opacity-100"
                    aria-hidden
                  >
                    <span className="font-accent text-xs uppercase tracking-[0.2em] text-white">
                      {item.category}
                    </span>
                    <h3
                      className="mt-2 text-center text-2xl leading-snug text-white sm:text-3xl"
                      style={{
                        fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
                        fontWeight: 300,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Services */}
      <section id="services" className="scroll-mt-20 border-t border-[#2C1810]/10 bg-[#F0EDE8] py-28 px-6">
        <div ref={servicesRef} className="mx-auto max-w-6xl" style={fadeStyle(servicesVisible)}>
          <p className="font-accent mb-3 text-xs uppercase tracking-[0.25em] text-[#C9A96E]">
            Services
          </p>
          <h2 className="font-display mb-20 text-3xl font-light tracking-tight text-[#2C1810] sm:text-4xl">
            서비스
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="border border-[#2C1810]/10 bg-white/70 px-8 py-10 transition duration-300 hover:border-[#C9A96E]/30 hover:bg-white/90"
              >
                <span className="mb-6 block font-display text-2xl font-light text-[#C9A96E]">
                  {s.icon}
                </span>
                <h3 className="font-display mb-4 text-xl font-light text-[#2C1810]">
                  {s.title}
                </h3>
                <p className="font-serif text-[15px] leading-relaxed text-[#2C1810]/75">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. AI Styling Experience */}
      <section id="ai-styling" className="scroll-mt-20 border-t border-[#2C1810]/10 py-28 px-6">
        <div ref={aiRef} className="mx-auto max-w-4xl" style={fadeStyle(aiVisible)}>
          <p className="font-accent mb-3 text-xs uppercase tracking-[0.25em] text-[#C9A96E]">
            Experience
          </p>
          <h2 className="font-display mb-4 text-3xl font-light tracking-tight text-[#2C1810] sm:text-4xl">
            AI 인테리어 스타일링 체험
          </h2>
          <p className="mb-14 max-w-xl font-serif text-[#2C1810]/75 leading-relaxed">
            공간 사진을 업로드하고 원하는 스타일을 선택해 보세요. (체험용 UI)
          </p>
          <div className="grid gap-10 md:grid-cols-2">
            <div className="border border-[#2C1810]/10 bg-white/70 p-8">
              <label className="font-accent mb-4 block text-xs uppercase tracking-[0.15em] text-[#2C1810]">
                공간 이미지 업로드
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-[#2C1810]/70 file:mr-4 file:rounded-sm file:border file:border-[#2C1810]/20 file:bg-transparent file:px-4 file:py-2.5 file:text-xs file:font-medium file:uppercase file:tracking-wider file:text-[#2C1810] file:transition file:hover:bg-[#2C1810]/5"
              />
              {uploadedImage ? (
                <div className="mt-6 aspect-video overflow-hidden bg-[#2C1810]/5">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="mt-6 flex aspect-video items-center justify-center bg-[#2C1810]/5 font-serif text-sm text-[#2C1810]/40">
                  이미지를 선택하면 미리보기가 표시됩니다
                </div>
              )}
            </div>
            <div className="border border-[#2C1810]/10 bg-white/70 p-8">
              <label className="font-accent mb-4 block text-xs uppercase tracking-[0.15em] text-[#2C1810]">
                스타일 선택
              </label>
              <div className="flex flex-wrap gap-3">
                {STYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedStyle(opt.id)}
                    className={`border px-4 py-2.5 text-sm font-medium transition ${
                      selectedStyle === opt.id
                        ? "border-[#2C1810] bg-[#2C1810] text-[#F5F0EB]"
                        : "border-[#2C1810]/20 bg-transparent font-serif text-[#2C1810] hover:border-[#C9A96E]/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="mt-8 font-serif text-sm leading-relaxed text-[#2C1810]/60">
                이미지와 스타일을 선택한 후 실제 서비스에서는 AI가 적용된 결과를 보여줍니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Lectures */}
      <section id="lectures" className="scroll-mt-20 border-t border-[#2C1810]/10 bg-[#F0EDE8] py-28 px-6">
        <div ref={lecturesRef} className="mx-auto max-w-6xl" style={fadeStyle(lecturesVisible)}>
          <p className="font-accent mb-3 text-xs uppercase tracking-[0.25em] text-[#C9A96E]">
            Lectures
          </p>
          <h2 className="font-display mb-20 text-3xl font-light tracking-tight text-[#2C1810] sm:text-4xl">
            강의 · 콘텐츠
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            {LECTURES.map((lec) => (
              <div
                key={lec.title}
                className="border border-[#2C1810]/10 bg-white/70 px-8 py-10 transition duration-300 hover:border-[#C9A96E]/30 hover:bg-white/90"
              >
                <h3 className="font-display mb-3 text-xl font-light text-[#2C1810]">
                  {lec.title}
                </h3>
                <p className="mb-8 font-serif text-[15px] leading-relaxed text-[#2C1810]/75">
                  {lec.desc}
                </p>
                <a
                  href="#contact"
                  className="inline-block border border-[#2C1810] px-6 py-2.5 text-sm font-medium text-[#2C1810] transition hover:bg-[#2C1810] hover:text-[#F5F0EB]"
                >
                  신청하기
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Contact */}
      <section id="contact" className="scroll-mt-20 border-t border-[#2C1810]/10 py-28 px-6">
        <div ref={contactRef} className="mx-auto max-w-2xl" style={fadeStyle(contactVisible)}>
          <p className="font-accent mb-3 text-xs uppercase tracking-[0.25em] text-[#C9A96E]">
            Contact
          </p>
          <h2 className="font-display mb-6 text-3xl font-light tracking-tight text-[#2C1810] sm:text-4xl">
            문의하기
          </h2>
          <p className="mb-12 font-serif text-[#2C1810]/75 leading-relaxed">
            프로젝트 문의, 협업 제안, 강의 관련 문의를 남겨 주세요.
          </p>
          <form onSubmit={handleContactSubmit} className="space-y-8">
            <div>
              <label htmlFor="name" className="font-accent mb-2 block text-xs uppercase tracking-[0.15em] text-[#2C1810]">
                이름
              </label>
              <input
                id="name"
                type="text"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full border border-[#2C1810]/20 bg-white/80 px-4 py-3.5 font-serif text-[#2C1810] placeholder:text-[#2C1810]/40 focus:border-[#2C1810]/40 focus:outline-none focus:ring-1 focus:ring-[#2C1810]/20"
                placeholder="이름을 입력하세요"
              />
            </div>
            <div>
              <label htmlFor="email" className="font-accent mb-2 block text-xs uppercase tracking-[0.15em] text-[#2C1810]">
                이메일
              </label>
              <input
                id="email"
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full border border-[#2C1810]/20 bg-white/80 px-4 py-3.5 font-serif text-[#2C1810] placeholder:text-[#2C1810]/40 focus:border-[#2C1810]/40 focus:outline-none focus:ring-1 focus:ring-[#2C1810]/20"
                placeholder="example@email.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="font-accent mb-2 block text-xs uppercase tracking-[0.15em] text-[#2C1810]">
                문의 내용
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={contactForm.message}
                onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                className="w-full resize-none border border-[#2C1810]/20 bg-white/80 px-4 py-3.5 font-serif text-[#2C1810] placeholder:text-[#2C1810]/40 focus:border-[#2C1810]/40 focus:outline-none focus:ring-1 focus:ring-[#2C1810]/20"
                placeholder="문의 내용을 입력하세요"
              />
            </div>
            <button
              type="submit"
              className="w-full border border-[#2C1810] bg-[#2C1810] py-3.5 text-sm font-medium text-[#F5F0EB] transition hover:bg-[#2C1810]/90 sm:w-auto sm:px-12"
            >
              보내기
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2C1810]/10 py-10 px-6 text-center">
        <p className="font-accent text-xs uppercase tracking-[0.2em] text-[#2C1810]/50">
          © {new Date().getFullYear()} HUEFLOW STUDIO
        </p>
      </footer>
    </div>
  );
}

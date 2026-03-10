export const PORTFOLIO_ITEMS = [
  { id: 1, title: "스터디카페 리뉴얼", category: "COMMERCIAL", image: "/images/study-cafe.png", slug: "study-cafe" },
  { id: 2, title: "하나로마트", category: "COMMERCIAL", image: "/images/hanaromart.png", slug: "hanaromart" },
  { id: 3, title: "프라이빗 빌라", category: "RESIDENTIAL", image: "/images/villa.png", slug: "villa" },
  { id: 4, title: "대형약국", category: "COMMERCIAL", image: "/images/pharmacy.png", slug: "pharmacy" },
  { id: 5, title: "아파트 파사드", category: "ARCHITECTURE", image: "/images/apartment-facade.png", slug: "apartment-facade" },
  { id: 6, title: "마트 파사드", category: "ARCHITECTURE", image: "/images/mart-facade.jpg", slug: "mart-facade" },
] as const;

export type PortfolioSlug = (typeof PORTFOLIO_ITEMS)[number]["slug"];

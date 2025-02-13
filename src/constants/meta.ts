export const META = {
  title: "COMMA | 콤마 오락실",
  siteName: "COMMA",
  description:
    "추억을 깨우는 즐거운 쉼표! 바쁜 현대인들에게 잠깐의 여유를 제공하고 어린 시절 오락실 감성을 되살릴 수 있는 공간이 있다면 어떨까?",
  keyword: [
    "콤마",
    "Comma",
    "COMMA",
    "일상",
    "게임",
    "Game",
    "오락식",
    "테트리스",
    "지뢰찾기",
    "바운스볼",
    "플래피부",
    "슈팅게임",
  ],
  url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  naverVerification: process.env.NAVER_SITE_VERIFICATION || "",
  googleVerification: process.env.GOOGLE_SITE_VERIFICATION || "",
  ogImage: `/meta/opengraph-image.png`,
} as const;

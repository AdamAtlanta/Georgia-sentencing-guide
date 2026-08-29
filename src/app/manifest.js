export default function manifest() {
  return {
    id: "/",
    name: "Georgia Sentencing Guide",
    short_name: "GA Sentencing",
    description:
      "A plain-language reference for Georgia criminal penalties and parole guidelines.",
    start_url: "/",
    scope: "/",
    lang: "en-US",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#F8FAFC",
    theme_color: "#0B1120",
    categories: ["legal", "reference", "productivity"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

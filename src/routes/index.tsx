import { createFileRoute } from "@tanstack/react-router";
import { GameProvider } from "@/game/store";
import { GameShell } from "@/components/game/GameShell";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Beyond the Bastions — A Vellore Fort History Adventure" },
      {
        name: "description",
        content:
          "Explore Vellore Fort in 3D: the crocodile-guarded moat, the yali pillars of Jalakanteswarar, sword drills, palm-leaf manuscripts, and the siege of 10 July 1806.",
      },
      { property: "og:title", content: "Beyond the Bastions — A Vellore Fort History Adventure" },
      {
        property: "og:description",
        content:
          "A 3D educational adventure inside the granite walls of Vellore Fort, from the moat keeper's rounds to the mutiny of 1806.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <GameProvider>
      <GameShell />
    </GameProvider>
  );
}

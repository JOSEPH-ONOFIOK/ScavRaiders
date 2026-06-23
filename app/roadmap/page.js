import PageShell from "@/components/PageShell";
import { Roadmap } from "@/components/Sections";

export const metadata = {
  title: "Roadmap — ScavRaiders | The Scrap Nexus",
  description: "The ScavRaiders drop sequence: allowlist, closed pre-alpha, founding mint, and free-to-play launch.",
};

export default function RoadmapPage() {
  return (
    <PageShell
      title="The Drop Sequence"
      sub="Four phases. Fun first, always — no pay-to-win at any stage."
    >
      <Roadmap />
    </PageShell>
  );
}

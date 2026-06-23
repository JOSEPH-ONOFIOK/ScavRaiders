import PageShell from "@/components/PageShell";
import { Factions } from "@/components/Sections";

export const metadata = {
  title: "Factions — ScavRaiders | The Scrap Nexus",
  description: "Meet the four founding ScavRaider factions. Every Founding mint awakens one.",
};

export default function FactionsPage() {
  return (
    <PageShell
      title="The Four Founding Factions"
      sub="Every Founding mint awakens one. Tap a card to reveal classified intel."
    >
      <Factions />
    </PageShell>
  );
}

import PageShell from "@/components/PageShell";
import { Perks } from "@/components/Sections";

export const metadata = {
  title: "Holder Perks — ScavRaiders | The Scrap Nexus",
  description: "Founding license perks: ownership, not advantage. Alpha access, governance, exclusive cosmetics, and more.",
};

export default function PerksPage() {
  return (
    <PageShell
      title="Holder Perks"
      sub="Ownership, not advantage — what a Founding license actually gets you."
    >
      <Perks />
    </PageShell>
  );
}

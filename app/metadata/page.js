import PageShell from "@/components/PageShell";
import Metadata from "@/components/Metadata";

export const metadata = {
  title: "Metadata — ScavRaiders | The Scrap Nexus",
  description: "A Founding license that earns its scars. Dynamic on-chain metadata that evolves with your play.",
};

export default function MetadataPage() {
  return (
    <PageShell
      title="An NFT That Earns Its Scars"
      sub="Dynamic on-chain identity — every milestone written into your token's history."
    >
      <Metadata />
    </PageShell>
  );
}

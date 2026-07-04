import { DocsShell } from "@/app/components/DocsShell";
import { PortalHome } from "@/app/components/PortalHome";

export default function Home() {
  return (
    <DocsShell activePath="/">
      <PortalHome />
    </DocsShell>
  );
}

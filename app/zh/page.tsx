import { DocsShell } from "@/app/components/DocsShell";
import { PortalHome } from "@/app/components/PortalHome";

export default function ChineseHome() {
  return (
    <DocsShell activePath="/zh">
      <PortalHome language="zh-CN" />
    </DocsShell>
  );
}

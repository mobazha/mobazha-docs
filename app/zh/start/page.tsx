import { permanentRedirect } from "next/navigation";

export default function ChineseStartRedirectPage() {
  permanentRedirect("/zh");
}

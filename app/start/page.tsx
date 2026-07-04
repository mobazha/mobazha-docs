import { permanentRedirect } from "next/navigation";

export default function StartRedirectPage() {
  permanentRedirect("/");
}

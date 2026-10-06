import { redirect } from "next/navigation";

// Studio Presencia pasó a llamarse Studio Search Console.
export default function StudioPresenciaRedirect() {
  redirect("/studio/search-console");
}

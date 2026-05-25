// app/page.js
import { redirect } from "next/navigation";

export default function RootPage() {
  // Detect locale from headers or cookies
  redirect("/en");

  // Or with logic:
  // const locale = detectUserLocale(); // Your detection logic
  // redirect(`/${locale}`);

  return null; // This won't render as redirect happens first
}

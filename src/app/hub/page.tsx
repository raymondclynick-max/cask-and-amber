// SERVER COMPONENT — keep this minimal
import HubClient from "./HubClient";

export const metadata = {
  title: "Hub — Cask & Amber",
  description: "Choose a section.",
};

export default function Page() {
  return <HubClient />;
}

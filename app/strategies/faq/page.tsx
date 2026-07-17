import MarkdownPage from "@/components/MarkdownPage";

export const metadata = {
  title: "Strategy vaults FAQ — Ada Watch Bot",
  description: "Why tradeable is less than deposited, what the reserves are, and who controls your vault.",
};

export default function StrategiesFaq() {
  return <MarkdownPage file="resources/STRATEGIES_FAQ.md" />;
}

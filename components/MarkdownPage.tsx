import fs from "node:fs";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownPage({ file }: { file: string }) {
  const markdown = fs.readFileSync(path.join(process.cwd(), file), "utf-8");
  return (
    <main className="max-w-3xl mx-auto px-5 py-16 prose-dark">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </main>
  );
}

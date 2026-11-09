import { CopyButton } from "@/components/CopyButton/CopyButton";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = "ruby", showLineNumbers = false }: CodeBlockProps) {
  const trimmed = code.replace(/\n$/, "");
  const lines = trimmed.split("\n");

  return (
    <figure className="my-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 text-slate-100">
      <figcaption className="flex items-center justify-between border-b border-slate-800 px-3 py-1.5">
        <span className="font-mono text-xs uppercase tracking-wide text-slate-400">{language}</span>
        <CopyButton text={trimmed} />
      </figcaption>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono">
          {lines.map((line, index) => (
            <span key={index} className="block">
              {showLineNumbers && (
                <span className="mr-4 inline-block w-6 select-none text-right text-slate-600">{index + 1}</span>
              )}
              {line || " "}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}

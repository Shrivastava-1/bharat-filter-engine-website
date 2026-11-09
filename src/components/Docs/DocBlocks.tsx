import { CodeBlock } from "@/components/CodeBlock/CodeBlock";
import { Callout } from "@/components/ui/Callout";
import type { DocBlock } from "@/data/docs";

export function DocBlocks({ blocks }: { blocks: DocBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h2":
            return <h2 key={index} className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">{block.text}</h2>;
          case "p":
            return <p key={index} className="mt-3 leading-7">{block.text}</p>;
          case "code":
            return <CodeBlock key={index} code={block.code} language={block.language} />;
          case "callout":
            return <Callout key={index} kind={block.kind} title={block.title}><p>{block.text}</p></Callout>;
        }
      })}
    </>
  );
}

import fs from 'fs/promises';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import type { ComponentPropsWithoutRef } from 'react';

type MarkdownRendererProps = {
  /** Path to the .md file, relative to the project root */
  filePath: string;
};

export default async function MarkdownRenderer({ filePath }: MarkdownRendererProps) {
  const absolutePath = path.join(process.cwd(), filePath);
  const source = await fs.readFile(absolutePath, 'utf-8');

  return (
    <ReactMarkdown
      components={{
        // Make links clickable; external links open in a new tab
        a: ({ href, children, ...rest }: ComponentPropsWithoutRef<'a'>) => {
          const isExternal = href?.startsWith('http');
          return (
            <a
              href={href}
              {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              {...rest}
            >
              {children}
            </a>
          );
        },
      }}
    >
      {source}
    </ReactMarkdown>
  );
}

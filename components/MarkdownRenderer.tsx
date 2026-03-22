import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Note: Ensure `katex` CSS is loaded in index.html for correct display.

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-sm md:prose-base prose-slate max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="relative group">
                <div className="absolute right-2 top-2 text-xs text-gray-400 select-none">
                  {match[1]}
                </div>
                <pre className={`${className} bg-gray-900 rounded-md p-4 overflow-x-auto my-2 text-gray-100`}>
                  <code {...props} className={className}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code {...props} className={`${className} bg-gray-200 dark:bg-gray-700 rounded px-1 py-0.5 text-sm font-mono text-red-600 dark:text-red-400`}>
                {children}
              </code>
            );
          },
          // Custom styling for headers to match the "Education Expert" vibe
          h1: ({ children }) => <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mt-6 mb-4 border-b pb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold text-teal-700 dark:text-teal-400 mt-5 mb-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">{children}</h3>,
          ul: ({ children }) => <ul className="list-disc list-outside ml-5 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-outside ml-5 space-y-1">{children}</ol>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 italic bg-indigo-50 dark:bg-indigo-900/30 text-gray-700 dark:text-gray-300 my-4 rounded-r">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
             <div className="overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
                   {children}
                </table>
             </div>
          ),
          th: ({children}) => <th className="px-3 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-left">{children}</th>,
          td: ({children}) => <td className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;

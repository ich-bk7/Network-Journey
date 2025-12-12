import React from 'react';

interface SimpleMarkdownProps {
  children: string;
}

const SimpleMarkdown: React.FC<SimpleMarkdownProps> = ({ children }) => {
  if (!children) return null;

  const lines = children.split('\n');
  const elements: React.ReactNode[] = [];
  
  let inCodeBlock = false;

  const parseInline = (text: string) => {
      // Split by Bold (**text**)
      const boldParts = text.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="text-slate-900 font-bold">{part.slice(2, -2)}</strong>;
          }
          // Split by Code (`text`)
          const codeParts = part.split(/(`.*?`)/g);
          return codeParts.map((subPart, j) => {
               if (subPart.startsWith('`') && subPart.endsWith('`')) {
                   return <code key={`${i}-${j}`} className="bg-slate-100 text-pink-600 font-mono px-1 py-0.5 rounded text-sm">{subPart.slice(1, -1)}</code>;
               }
               return subPart;
          });
      });
  };

  lines.forEach((line, index) => {
    // Code Blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return; 
    }
    if (inCodeBlock) {
       elements.push(
         <div key={index} className="bg-slate-800 text-green-400 font-mono text-sm p-4 rounded-lg my-4 whitespace-pre-wrap overflow-x-auto shadow-lg border border-slate-700">
           {line}
         </div>
       );
       return;
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(<h3 key={index} className="text-xl font-bold text-slate-800 mt-8 mb-3 flex items-center"><span className="w-1 h-6 bg-blue-500 rounded mr-3"></span>{line.replace('### ', '')}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={index} className="text-2xl font-bold text-slate-900 mt-10 mb-4 border-b border-slate-200 pb-2">{line.replace('## ', '')}</h2>);
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={index} className="text-4xl font-extrabold text-slate-900 mt-6 mb-6 tracking-tight">{line.replace('# ', '')}</h1>);
    } 
    // Blockquotes
    else if (line.startsWith('> ')) {
        elements.push(
            <blockquote key={index} className="border-l-4 border-blue-400 pl-4 italic text-slate-600 my-4 bg-slate-50 py-2 rounded-r">
                {parseInline(line.replace('> ', ''))}
            </blockquote>
        )
    }
    // Lists
    else if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
       const content = line.trim().substring(2);
       const isNested = line.startsWith('    ');
       
       elements.push(
         <div key={index} className={`flex items-start mb-2 ${isNested ? 'ml-8' : 'ml-2'}`}>
            <span className={`mr-2 mt-1.5 flex-shrink-0 ${isNested ? 'w-1.5 h-1.5 bg-slate-400' : 'w-2 h-2 bg-blue-500'} rounded-full`}></span>
            <span className="text-slate-700 leading-relaxed">{parseInline(content)}</span>
         </div>
       );
    }
    // Numbered Lists (Simple detection)
    else if (/^\d+\.\s/.test(line.trim())) {
         const content = line.trim().replace(/^\d+\.\s/, '');
         const number = line.trim().match(/^\d+/)?.[0];
         elements.push(
             <div key={index} className="flex items-start ml-2 mb-2">
                 <span className="mr-3 text-slate-400 font-bold font-mono min-w-[20px]">{number}.</span>
                 <span className="text-slate-700 leading-relaxed">{parseInline(content)}</span>
             </div>
         )
    }
    // Paragraphs / Normal text
    else if (line.trim() !== '') {
       elements.push(<p key={index} className="text-slate-700 mb-4 leading-7 text-base lg:text-lg">{parseInline(line)}</p>);
    }
  });

  return <div className="space-y-1 font-sans">{elements}</div>;
};

export default SimpleMarkdown;
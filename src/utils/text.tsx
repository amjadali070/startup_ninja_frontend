import React from 'react';

// Rich text renderer: urls, hashtags, mentions, newlines
export const renderRichText = (text: string, keyPrefix = 'rt') => {
  const parts: React.ReactNode[] = [];
  if (!text) return parts;
  const regex = /(https?:\/\/[^\s]+)|(^|\s)(#[A-Za-z0-9_]+)|(^|\s)(@[A-Za-z0-9_\.]+)|\n/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    const index = match.index;
    if (index > lastIndex) {
      parts.push(<span key={`${keyPrefix}-t-${i++}`}>{text.slice(lastIndex, index)}</span>);
    }
    const [full, url, hashSpace, hash, atSpace, mention] = match as any;
    if (url) {
      parts.push(
        <a key={`${keyPrefix}-u-${i++}`} href={url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline break-all">
          {url}
        </a>
      );
    } else if (hash) {
      const space = hashSpace || '';
      parts.push(<span key={`${keyPrefix}-hs-${i++}`}>{space}</span>);
      parts.push(<span key={`${keyPrefix}-h-${i++}`} className="text-red-400">{hash}</span>);
    } else if (mention) {
      const space = atSpace || '';
      parts.push(<span key={`${keyPrefix}-ms-${i++}`}>{space}</span>);
      parts.push(<span key={`${keyPrefix}-m-${i++}`} className="text-green-400">{mention}</span>);
    } else if (full === '\n') {
      parts.push(<br key={`${keyPrefix}-br-${i++}`} />);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(<span key={`${keyPrefix}-t-${i++}`}>{text.slice(lastIndex)}</span>);
  }
  return parts;
};



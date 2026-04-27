/**
 * KaraokeText - Testo con evidenziazione sincronizzata stile karaoke
 *
 * Features:
 * - Evidenziazione parola corrente
 * - Scroll automatico alla parola
 * - Supporto per parsing markdown base
 * - Animazioni fluide
 * - Design child-friendly
 */
import { useRef, useEffect, useMemo } from 'react';

// Token types
const TOKEN_TYPES = {
  HEADING: 'heading',
  BOLD: 'bold',
  ITALIC: 'italic',
  EMOJI: 'emoji',
  WORD: 'word',
  SPACE: 'space',
  NEWLINE: 'newline',
  BULLET: 'bullet',
};

// Regex per parsing
const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]/gu;
const HEADING_REGEX = /^(#{1,3})\s+(.+)$/gm;
const BOLD_REGEX = /\*\*([^*]+)\*\*/g;
const ITALIC_REGEX = /\*([^*]+)\*/g;
const BULLET_REGEX = /^[-*]\s+/gm;

/**
 * Parsa il testo markdown in token
 */
function parseText(text) {
  if (!text) return [];

  const tokens = [];
  let wordIndex = 0;

  // Prima rimuoviamo markdown per contare le parole
  const cleanText = text
    .replace(HEADING_REGEX, '$2')
    .replace(BOLD_REGEX, '$1')
    .replace(ITALIC_REGEX, '$1')
    .replace(BULLET_REGEX, '')
    .replace(EMOJI_REGEX, ' ')
    .trim();

  const words = cleanText.split(/\s+/).filter(w => w.length > 0);

  // Ora processiamo linea per linea
  const lines = text.split('\n');

  lines.forEach((line, lineIdx) => {
    // Check if heading
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = headingMatch[2];

      tokens.push({
        type: TOKEN_TYPES.HEADING,
        level,
        content: parseInline(content, words, () => wordIndex++),
      });
      tokens.push({ type: TOKEN_TYPES.NEWLINE });
      return;
    }

    // Check if bullet
    const bulletMatch = line.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      tokens.push({ type: TOKEN_TYPES.BULLET });
      const content = bulletMatch[1];
      tokens.push(...parseInline(content, words, () => wordIndex++));
      tokens.push({ type: TOKEN_TYPES.NEWLINE });
      return;
    }

    // Normal line
    if (line.trim()) {
      tokens.push(...parseInline(line, words, () => wordIndex++));
    }

    if (lineIdx < lines.length - 1) {
      tokens.push({ type: TOKEN_TYPES.NEWLINE });
    }
  });

  return tokens;
}

/**
 * Parsa contenuto inline (bold, italic, emoji, parole)
 */
function parseInline(text, allWords, getWordIndex) {
  const tokens = [];
  let remaining = text;
  let lastIndex = 0;

  // Process character by character for accurate word indexing
  const parts = remaining.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\s+)/g).filter(Boolean);

  parts.forEach(part => {
    // Bold
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) {
      const words = boldMatch[1].split(/\s+/).filter(w => w.length > 0);
      words.forEach((word, i) => {
        const cleanWord = word.replace(EMOJI_REGEX, '');
        if (cleanWord) {
          tokens.push({
            type: TOKEN_TYPES.BOLD,
            content: word,
            wordIndex: getWordIndex(),
          });
        } else {
          // Only emoji
          tokens.push({ type: TOKEN_TYPES.EMOJI, content: word });
        }
        if (i < words.length - 1) {
          tokens.push({ type: TOKEN_TYPES.SPACE });
        }
      });
      return;
    }

    // Italic
    const italicMatch = part.match(/^\*([^*]+)\*$/);
    if (italicMatch) {
      const words = italicMatch[1].split(/\s+/).filter(w => w.length > 0);
      words.forEach((word, i) => {
        const cleanWord = word.replace(EMOJI_REGEX, '');
        if (cleanWord) {
          tokens.push({
            type: TOKEN_TYPES.ITALIC,
            content: word,
            wordIndex: getWordIndex(),
          });
        } else {
          tokens.push({ type: TOKEN_TYPES.EMOJI, content: word });
        }
        if (i < words.length - 1) {
          tokens.push({ type: TOKEN_TYPES.SPACE });
        }
      });
      return;
    }

    // Whitespace
    if (/^\s+$/.test(part)) {
      tokens.push({ type: TOKEN_TYPES.SPACE });
      return;
    }

    // Regular word or emoji
    const cleanWord = part.replace(EMOJI_REGEX, '');
    const emojis = part.match(EMOJI_REGEX) || [];

    if (cleanWord) {
      tokens.push({
        type: TOKEN_TYPES.WORD,
        content: part,
        wordIndex: getWordIndex(),
      });
    } else if (emojis.length > 0) {
      tokens.push({ type: TOKEN_TYPES.EMOJI, content: part });
    }
  });

  return tokens;
}

/**
 * Renderizza un token
 */
function TokenRenderer({ token, isActive, activeRef }) {
  const baseClass = 'transition-all duration-200';

  const activeClass = isActive
    ? 'bg-yellow-300 text-amber-900 rounded px-1 scale-110 shadow-lg ring-2 ring-yellow-400'
    : '';

  switch (token.type) {
    case TOKEN_TYPES.HEADING:
      const HeadingTag = `h${token.level}`;
      const headingClasses = {
        1: 'text-3xl font-bold text-amber-700 mb-4 flex items-center gap-2',
        2: 'text-2xl font-bold text-amber-600 mb-3 flex items-center gap-2',
        3: 'text-xl font-bold text-blue-600 mb-2',
      };
      return (
        <HeadingTag className={headingClasses[token.level]}>
          {token.level === 1 && <span className="text-3xl">🦁</span>}
          {token.content.map((t, i) => (
            <TokenRenderer
              key={i}
              token={t}
              isActive={t.wordIndex !== undefined && t.wordIndex === activeRef?.current}
              activeRef={activeRef}
            />
          ))}
        </HeadingTag>
      );

    case TOKEN_TYPES.BOLD:
      return (
        <strong
          ref={isActive ? activeRef : undefined}
          className={`font-bold text-amber-700 bg-amber-50 ${baseClass} ${activeClass}`}
        >
          {token.content}
        </strong>
      );

    case TOKEN_TYPES.ITALIC:
      return (
        <em
          ref={isActive ? activeRef : undefined}
          className={`text-blue-600 not-italic font-semibold ${baseClass} ${activeClass}`}
        >
          {token.content}
        </em>
      );

    case TOKEN_TYPES.EMOJI:
      return <span className="text-2xl mx-1">{token.content}</span>;

    case TOKEN_TYPES.WORD:
      return (
        <span
          ref={isActive ? activeRef : undefined}
          className={`${baseClass} ${activeClass}`}
        >
          {token.content}
        </span>
      );

    case TOKEN_TYPES.SPACE:
      return <span> </span>;

    case TOKEN_TYPES.NEWLINE:
      return <br />;

    case TOKEN_TYPES.BULLET:
      return <span className="text-2xl mr-2">🌟</span>;

    default:
      return null;
  }
}

export default function KaraokeText({
  text,
  currentWordIndex = -1,
  isPlaying = false,
  className = '',
}) {
  const containerRef = useRef(null);
  const activeWordRef = useRef(null);

  // Parse text into tokens
  const tokens = useMemo(() => parseText(text), [text]);

  // Auto-scroll to active word
  useEffect(() => {
    if (isPlaying && activeWordRef.current && containerRef.current) {
      activeWordRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }, [currentWordIndex, isPlaying]);

  // Contatore per assegnare wordIndex durante il render
  let renderWordIndex = 0;

  return (
    <div
      ref={containerRef}
      className={`text-2xl md:text-3xl leading-loose text-gray-800 font-medium ${className}`}
    >
      {tokens.map((token, idx) => {
        const isActive = isPlaying &&
          token.wordIndex !== undefined &&
          token.wordIndex === currentWordIndex;

        return (
          <TokenRenderer
            key={idx}
            token={token}
            isActive={isActive}
            activeRef={isActive ? activeWordRef : null}
          />
        );
      })}
    </div>
  );
}

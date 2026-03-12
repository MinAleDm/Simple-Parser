export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface HeadingItem {
  level: HeadingLevel;
  text: string;
}

export interface HeadingSummary {
  counts: Record<HeadingLevel, number>;
  total: number;
  items: HeadingItem[];
}

export interface MetadataSummary {
  title: string | null;
  description: string | null;
  keywords: string[];
  canonicalUrl: string | null;
  language: string | null;
}

export interface ContactSummary {
  emails: string[];
  phoneNumbers: string[];
  contactLinks: string[];
}

export interface LinkSummary {
  total: number;
  internal: number;
  external: number;
  anchor: number;
  mailto: number;
  tel: number;
}

export interface MediaSummary {
  images: number;
  imagesMissingAlt: number;
  scripts: number;
  stylesheets: number;
}

export interface StructureSummary {
  lists: number;
  tables: number;
  forms: number;
  formControls: number;
  buttons: number;
}

export interface TextSummary {
  wordCount: number;
  characterCount: number;
  readingTimeMinutes: number;
}

export type TokenType = 'tag-open' | 'tag-close' | 'text' | 'comment' | 'doctype';

export interface Token {
  type: TokenType;
  value: string;
  start: number;
  end: number;
}

export type AstNodeType = 'root' | 'element' | 'text' | 'comment' | 'directive';

export interface AstNode {
  type: AstNodeType;
  name?: string;
  attributes?: Record<string, string>;
  value?: string;
  children?: AstNode[];
}

export interface ParseSource {
  kind: 'html' | 'url';
  value: string;
}

export interface ParseOptions {
  includeTokens?: boolean;
  includeAst?: boolean;
  normalizeWhitespace?: boolean;
}

export interface ParseResult {
  source: ParseSource;
  metadata: MetadataSummary;
  headings: HeadingSummary;
  contacts: ContactSummary;
  links: LinkSummary;
  media: MediaSummary;
  structure: StructureSummary;
  text: TextSummary;
  tokens: Token[];
  ast: AstNode | null;
}

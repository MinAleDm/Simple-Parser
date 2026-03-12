import { parseDocument } from 'htmlparser2';
import { isTag, type AnyNode, type Document, type Element } from 'domhandler';

export function parseHtmlDocument(html: string): Document {
  return parseDocument(html, {
    decodeEntities: true,
    recognizeSelfClosing: true
  });
}

export function walkNodes(nodes: AnyNode[], visitor: (node: AnyNode) => void): void {
  for (const node of nodes) {
    visitor(node);

    if ('children' in node && Array.isArray(node.children) && node.children.length > 0) {
      walkNodes(node.children, visitor);
    }
  }
}

export function collectElements(
  document: Document,
  predicate: (element: Element) => boolean
): Element[] {
  const elements: Element[] = [];

  walkNodes(document.children, (node) => {
    if (isTag(node) && predicate(node)) {
      elements.push(node);
    }
  });

  return elements;
}

export function getNodeText(node: AnyNode): string {
  if (node.type === 'text') {
    return node.data;
  }

  if (!('children' in node) || !Array.isArray(node.children)) {
    return '';
  }

  return node.children.map(getNodeText).join('');
}

export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

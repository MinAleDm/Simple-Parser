import type { AnyNode, Document } from 'domhandler';

import type { AstNode } from '../types.js';
import { normalizeWhitespace } from '../utils/dom.js';

function mapNode(node: AnyNode, normalizeText: boolean): AstNode | null {
  if (node.type === 'text') {
    const value = normalizeText ? normalizeWhitespace(node.data) : node.data;

    if (!value) {
      return null;
    }

    return {
      type: 'text',
      value
    };
  }

  if (node.type === 'comment') {
    const value = normalizeText ? normalizeWhitespace(node.data) : node.data;

    return {
      type: 'comment',
      value
    };
  }

  if (node.type === 'directive') {
    return {
      type: 'directive',
      value: node.data
    };
  }

  if (node.type === 'tag' || node.type === 'script' || node.type === 'style') {
    const children = node.children
      .map((child) => mapNode(child, normalizeText))
      .filter((child): child is AstNode => child !== null);

    return {
      type: 'element',
      name: node.name,
      attributes: { ...node.attribs },
      children
    };
  }

  return null;
}

export function buildAst(document: Document, normalizeText: boolean): AstNode {
  return {
    type: 'root',
    children: document.children
      .map((child) => mapNode(child, normalizeText))
      .filter((child): child is AstNode => child !== null)
  };
}

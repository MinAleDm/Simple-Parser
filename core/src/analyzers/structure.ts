import type { Document } from 'domhandler';

import type { StructureSummary } from '../types.js';
import { collectElements } from '../utils/dom.js';

const LIST_TAGS = new Set(['ul', 'ol', 'dl']);
const FORM_CONTROL_TAGS = new Set(['input', 'select', 'textarea']);

export function extractStructure(document: Document): StructureSummary {
  // Эти агрегаты показывают, насколько страница интерактивна и насыщена контентом.
  const lists = collectElements(document, (element) => LIST_TAGS.has(element.name)).length;
  const tables = collectElements(document, (element) => element.name === 'table').length;
  const forms = collectElements(document, (element) => element.name === 'form').length;
  const formControls = collectElements(document, (element) => FORM_CONTROL_TAGS.has(element.name)).length;
  const buttons = collectElements(document, (element) => element.name === 'button').length;

  return {
    lists,
    tables,
    forms,
    formControls,
    buttons
  };
}

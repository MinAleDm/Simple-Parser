import type { Document } from 'domhandler';

import type { MediaSummary } from '../types.js';
import { collectElements } from '../utils/dom.js';

export function extractMedia(document: Document): MediaSummary {
  const imageTags = collectElements(document, (element) => element.name === 'img');
  const scriptTags = collectElements(document, (element) => element.name === 'script');
  const stylesheetLinks = collectElements(
    document,
    (element) => element.name === 'link' && element.attribs.rel?.toLowerCase() === 'stylesheet'
  );

  const imagesMissingAlt = imageTags.filter((imageTag) => !imageTag.attribs.alt?.trim()).length;

  return {
    images: imageTags.length,
    imagesMissingAlt,
    scripts: scriptTags.length,
    stylesheets: stylesheetLinks.length
  };
}

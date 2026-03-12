export function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

export function uniqueNonEmpty(values: string[]): string[] {
  return unique(values.map((value) => value.trim()).filter(Boolean));
}

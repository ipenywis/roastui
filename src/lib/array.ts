export function isValidAndNotEmptyArray(
  value: any[] | null | undefined,
): boolean {
  return (
    value !== null &&
    value !== undefined &&
    Array.isArray(value) &&
    value.length > 0
  );
}

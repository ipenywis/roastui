export function isValidAndNotEmptyString(
  value: string | null | undefined,
): boolean {
  return (
    value !== null &&
    value !== undefined &&
    typeof value === 'string' &&
    value.length > 0
  );
}

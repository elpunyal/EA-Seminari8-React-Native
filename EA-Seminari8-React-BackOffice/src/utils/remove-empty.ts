export function removeEmpty<T extends object>(data: T): Partial<T> {
  const result: Partial<T> = {};

  for (const key of Object.keys(data) as (keyof T)[]) {
    const value = data[key];
    const isEmpty =
      value === null || value === undefined || (typeof value === 'string' && value.trim() === '');

    if (!isEmpty) {
      result[key] = value;
    }
  }

  return result;
}

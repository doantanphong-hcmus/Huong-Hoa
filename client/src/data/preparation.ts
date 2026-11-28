export function splitByStatus<T>(items: T[], key: keyof T = 'done' as keyof T): [T[], T[]] {
  return [items.filter((item) => !item[key]), items.filter((item) => item[key])]
}

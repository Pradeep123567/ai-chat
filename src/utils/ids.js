export function makeId(prefix = 'id') {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`
}
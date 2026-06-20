export function parseCsv(text) {
  const input = `${text ?? ''}`.replace(/^\uFEFF/, '')
  const rows = []
  let row = []
  let cell = ''
  let inQuotes = false

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index]
    const next = input[index + 1]

    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"'
        index += 1
      } else if (char === '"') {
        inQuotes = false
      } else {
        cell += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
      continue
    }

    if (char === ',') {
      row.push(cell)
      cell = ''
      continue
    }

    if (char === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
      continue
    }

    if (char !== '\r') {
      cell += char
    }
  }

  row.push(cell)
  rows.push(row)

  return rows.filter((currentRow) => currentRow.some((value) => `${value}`.trim() !== ''))
}

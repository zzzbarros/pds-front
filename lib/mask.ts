function name(input: string) {
  return input.replace(/[^\p{L}\p{M} ]+/gu, '')
}

export const mask = { name }

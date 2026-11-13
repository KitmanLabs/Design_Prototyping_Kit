// Every number on a screen that the specification doesn't state, one name per concept.
// Pages read the value with placeholder('NAME') and never repeat the literal number.
//
//   name    'MAX_DRILLS_PER_SESSION'
//   value   12
//   unit    'drills'
//   routes  the paths in routes.js that show it (a hint: the reading still traces the code)

export const placeholders = []

export function placeholder(name) {
  const found = placeholders.find((p) => p.name === name)
  if (!found) {
    throw new Error(`No placeholder named ${name} in src/prototype/placeholders.js.`)
  }
  return found.value
}

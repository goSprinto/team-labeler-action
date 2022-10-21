export function getTeamLabel(
  labelsConfiguration: Map<string, string[]>,
  author: string
): string[] {
  const labels: string[] = []
  for (const [label, authors] of labelsConfiguration.entries())
    if (authors.includes(author)) labels.push(label)
  return labels
}


export function getTeamMembers(
  labelsConfiguration: Map<string, string[]>,
  author: string
): string[] {
  for (const [label, authors] of labelsConfiguration.entries())
    if (authors.includes(author)) {
      const filteredAuthors = authors.filter(item => item !== author)
      return filteredAuthors
    }
  return []
}

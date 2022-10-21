import * as core from '@actions/core'

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
  core.info('getTeamMembers')
  for (const [label, authors] of labelsConfiguration.entries()) {
    core.info('inside loop')
    if (authors.includes(author)) {
      core.info(`authors ${authors}`)
      const filteredAuthors = authors.filter(item => item !== author)
      core.info(`filtered ${filteredAuthors}`)
      console.log(filteredAuthors)
      return filteredAuthors
    }
  }

  return []
}

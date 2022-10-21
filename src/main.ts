import * as core from '@actions/core'
import { getTeamLabel, getTeamMembers } from './teams'
import {
  getPrNumber,
  getPrAuthor,
  getLabelsConfiguration,
  addLabels,
  addReviewers,
  createClient
} from './github'

async function run() {
  try {
    const token = core.getInput('repo-token', { required: true })
    const configPath = core.getInput('configuration-path', { required: true })

    const prNumber = getPrNumber()
    if (!prNumber) {
      core.debug('Could not get pull request number from context, exiting')
      return
    }

    const author = getPrAuthor()
    if (!author) {
      core.debug('Could not get pull request user from context, exiting')
      return
    }

    const client = createClient(token)
    const labelsConfiguration: Map<
      string,
      string[]
    > = await getLabelsConfiguration(client, configPath)

    const labels: string[] = getTeamLabel(labelsConfiguration, `@${author}`)
    const reviewers: string[] = getTeamMembers(labelsConfiguration, `@${author}`)

    if (labels.length > 0) await addLabels(client, prNumber, labels)
    if (reviewers.length > 0) await addReviewers(client, prNumber, reviewers)
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

run()

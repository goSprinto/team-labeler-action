import * as core from '@actions/core'
import _ from 'lodash'
import { getTeamLabel, getTeamMembers } from './teams'
import {
  getPrNumber,
  getPrAuthor,
  getLabelsConfiguration,
  addLabels,
  addReviewers,
  getReviewers,
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

    const labels: string[] = getTeamLabel(labelsConfiguration, `${author}`)
    const reviewers: string[] = getTeamMembers(labelsConfiguration, `${author}`)

    const existing_reviewers = await getReviewers(client, prNumber)
    const { users } = existing_reviewers
    const new_reviewers = _.differenceWith(users, reviewers, (user, reviewer) => { user.login == reviewer })

    if (labels.length > 0) await addLabels(client, prNumber, labels)
    if (reviewers.length > 0) await addReviewers(client, prNumber, new_reviewers)
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

run()

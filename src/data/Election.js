import {BN128} from 'snarkjs'

import hashString from '../util/hashString'
import {AttributeMask} from './voter_attributes'

export default class Election {
  constructor(summary, attributeMask) {
    this.summary = summary
    this.attributeMask = attributeMask
    // TODO: This may not work. Try to figure out how to fix it
    this.commitment = BN128.Hash.hash([hashString(summary)].concat(attributeMask.witness()))
    this.votes = []
    this.ballots = new Set()
  }

  recordVote(vote) {
    if(this.ballots.has(vote.ballot))
      throw new Error('ballot already submitted')

    this.votes.push(vote)
    this.ballots.add(vote.ballot)
  }

  // TODO: make this something humans can understand
  tally() {
    return this.votes.reduce(([y, n], {answer}) => [y + !!answer, n + !answer], [0, 0])
  }

  printTally() {
    const [y, n] = this.tally()
    console.log('Yes: ' + y.toString() + '\nNo:  ' + n.toString())
  }

  toJson() {
    const {summary, attributeMask} = this
    return {summary, attributeMask: attributeMask.mask}
  }

  canVote(voter) {
  }
}

Election.fromJson = function(json) {
  if(!('summary' in json) || typeof json.summary !== 'string')
    throw new Error('missing or invalid "summary" param')
  if(!('attributeMask' in json) || !(json.attributeMask instanceof Array))
    throw new Error('missing or invalid "attributeMask" param')
  return new Election(json.summary, AttributeMask.ofStringArray(json.attributeMask))
}

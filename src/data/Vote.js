import {BN128} from 'snarkjs'

import hashString from '../util/hashString'

import Election from './Election'

export default class Vote {
  constructor(voter, election, answer) {
    this.voterCommitment = voter.commitment
    this.electionCommitment = election.commitment
    this.ballot = voter.ballot(election.commitment)
    this.answer = answer
  }

  statement(merkleTreeRoot, election) {
    if(!(election instanceof Election))
      throw new Error('Vote.statement() expects to receive election')

    if(!(election.commitment === this.electionCommitment))
      throw new Error('Vote.statement() received the wrong election')

    return [
      // this.voterCommitment.toString(),
      merkleTreeRoot,
      this.ballot,
      hashString(this.answer),
      election.attributeMask.mask.map((c) => c ? hashString(c) : BN128.Field.zero),
      this.electionCommitment
    ]
  }

  toJson() {
    const {voterCommitment, electionCommitment, ballot, answer} = this
    return {
      voterCommitment: voterCommitment.toString(),
      electionCommitment: electionCommitment.toString(),
      ballot: ballot.toString(),
      answer
    }
  }
}

Vote.fromJson = function(json) {
  const requiredParams = ['voterCommitment', 'electionCommitment', 'ballot', 'answer']

  requiredParams.forEach((requiredParam) => {
    if(!(requiredParam in json))
      throw `Vote.fromJson: missing or invalid parameter "${requiredParam}"`
  })

  return {
    __proto__: Vote.prototype,
    // TODO: Ensure that these types work. Sorry, didn't have the time to validate this.
    voterCommitment: BN128.Field.ofString(json.voterCommitment),
    electionCommitment: BN128.Field.ofString(json.electionCommitment),
    ballot: BN128.Field.ofString(json.ballot),
    answer: json.answer
  }
}

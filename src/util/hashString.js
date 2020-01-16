import {BN128} from 'snarkjs'

// This is an inefficient way to hash a string, but it's easy and it works :)
export default function hashString(name) {
  const charFields = Array.from(name).map((char) =>
    // TODO: Ensure this serializes correctly
    BN128.Field.ofInt(char.charCodeAt(0)))

  return BN128.Hash.hash(charFields)
}

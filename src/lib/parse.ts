import { ContractData } from '../schema/index.js'

export function parseContract (
  cache : ContractData,
  data  : ContractData
) {

  // Validate new endorsements
  
  // Validate new signatures

  // alert add / remove events
  
  // alert on details update

  // alert on key changes

  // alert on profile changes

}

function alert_on_full_endorsement () {
  // Alert when there is a full endorsement.
}

function check_endorsement_sig(pubkey, signature) {
  // Check if the endorsement signature is valid.
}

function check_pubkeys_match(...pubkeys : string[]) {
  // Dump all pubkeys from different components in here.
}

function check_group_keys () {
  // Check that the musig group keys are valid.
}

function check_partial_sig () {
  // Check if a partial signature is valid.
}

function check_taproot_tweak () {
  // Check if the taproot tweak is correct.
}

function check_tx_inputs() {
  // Check if the transaction inputs are valid.
}

function check_tx_claims () {
  // Check that the taproot key for the claim output is correct.
}

function check_tx_fees() {
  // Check if the transaction has the proper payment fields.
}

function check_tx_payments () {
  // Check if the transaction has the proper payment fields.
}

function check_tx_total () {
  // Check that the total value of the tx is correct.
}
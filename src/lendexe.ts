import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts";
import { store } from '@graphprotocol/graph-ts'
import {
  Transfer as TransferEvent
} from "../generated/Lendexe/Lendexe"
import { UserProfile } from "../generated/schema"
import { zeroAddress, zeroBI } from './helpers';
import { SNAPSHOT_BLOCK } from './constants';

export function handleTransfer(event: TransferEvent): void {
  if(event.block.number <= BigInt.fromI32(SNAPSHOT_BLOCK)) {
    if(event.params.to != zeroAddress()) {
      let toUser = UserProfile.load(event.params.to.toHexString());

      if(!toUser) {
        toUser = new UserProfile(event.params.to.toHexString());
        toUser.amount = event.params.value;
      } else {
        toUser.amount = toUser.amount.plus(event.params.value);
      }

      toUser.save();
    }

    if(event.params.from != zeroAddress()) {
      let fromUser = UserProfile.load(event.params.from.toHexString());

      if(fromUser) {
        fromUser.amount = fromUser.amount.minus(event.params.value);

        // we can delete the user if the amount is 0
        if(fromUser.amount.equals(zeroBI())) {
          store.remove('UserProfile', event.params.from.toHexString());
        } else {
          fromUser.save();
        }
      }
    }
  }
}

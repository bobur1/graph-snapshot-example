import { BigInt, Bytes } from '@graphprotocol/graph-ts/index'

export function zeroAddress(): Bytes {
    return Bytes.fromHexString('0x0000000000000000000000000000000000000000') as Bytes;
}

export function zeroBI(): BigInt {
    return BigInt.fromI32(0);
}

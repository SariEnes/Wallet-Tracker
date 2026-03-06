import * as StellarSdk from '@stellar/stellar-sdk';
import { HORIZON_URL, SOROBAN_RPC_URL, NETWORK_PASSPHRASE } from '@/lib/utils/constants';

export const horizon = new StellarSdk.Horizon.Server(HORIZON_URL);
export const rpc = new StellarSdk.rpc.Server(SOROBAN_RPC_URL);
export const networkPassphrase = NETWORK_PASSPHRASE;

export { StellarSdk };

import * as StellarSdk from '@stellar/stellar-sdk';
import { horizon } from './client';
import type { Transaction } from '@/types';

export interface TransactionPage {
  transactions: Transaction[];
  nextCursor: string | null;
}

type HorizonOperation = StellarSdk.Horizon.ServerApi.OperationRecord;

function mapOperation(op: HorizonOperation): Transaction {
  let type: Transaction['type'] = 'other';
  let amount = '0';
  let asset = 'XLM';
  let from = '';
  let to = '';

  // Cast to string to bypass TypeScript's enum-based type narrowing.
  // The Stellar SDK uses OperationResponseType enum keys, but runtime values are snake_case strings.
  const opType = op.type as string;

  switch (opType) {
    case 'payment': {
      const p = op as StellarSdk.Horizon.ServerApi.PaymentOperationRecord;
      type = 'payment';
      amount = p.amount;
      asset = p.asset_type === 'native' ? 'XLM' : `${p.asset_code}/${p.asset_issuer?.slice(0, 4)}`;
      from = p.from;
      to = p.to;
      break;
    }
    case 'create_account': {
      const ca = op as StellarSdk.Horizon.ServerApi.CreateAccountOperationRecord;
      type = 'create_account';
      amount = ca.starting_balance;
      asset = 'XLM';
      from = ca.funder;
      to = ca.account;
      break;
    }
    case 'path_payment_strict_send':
    case 'path_payment_strict_receive': {
      const pp = op as StellarSdk.Horizon.ServerApi.PathPaymentStrictSendOperationRecord;
      type = 'path_payment';
      amount = pp.amount;
      asset = pp.asset_type === 'native' ? 'XLM' : `${pp.asset_code}`;
      from = pp.from;
      to = pp.to;
      break;
    }
    case 'manage_sell_offer':
    case 'manage_buy_offer':
    case 'create_passive_sell_offer': {
      type = 'manage_offer';
      const mo = op as StellarSdk.Horizon.ServerApi.ManageOfferOperationRecord;
      amount = mo.amount;
      asset = mo.selling_asset_type === 'native' ? 'XLM' : `${mo.selling_asset_code}`;
      from = mo.source_account ?? '';
      to = '';
      break;
    }
    default:
      from = op.source_account ?? '';
  }

  return {
    id: op.id,
    type,
    amount,
    asset,
    from,
    to,
    timestamp: new Date(op.created_at),
    successful: true,
    memo: null,
  };
}

/**
 * Fetch the most recent operations for an account.
 * Returns transactions and a cursor for the next page.
 */
export async function fetchOperations(
  address: string,
  limit = 20,
  cursor?: string
): Promise<TransactionPage> {
  let builder = horizon
    .operations()
    .forAccount(address)
    .order('desc')
    .limit(limit)
    .includeFailed(false);

  if (cursor) {
    builder = builder.cursor(cursor);
  }

  const page = await builder.call();
  const records = page.records as HorizonOperation[];

  const transactions = records.map(mapOperation);

  const nextCursor =
    records.length === limit ? records[records.length - 1].paging_token : null;

  return { transactions, nextCursor };
}

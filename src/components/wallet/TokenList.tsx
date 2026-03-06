import type { TokenBalance } from '@/types';
import { formatAddress, formatNumber, formatUsd } from '@/lib/utils/format';

interface TokenListProps {
  tokens: TokenBalance[];
}

export default function TokenList({ tokens }: TokenListProps) {
  if (tokens.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-slate-500">
        No tokens found for this wallet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700 bg-slate-900/50">
            <th className="px-4 py-3 text-left font-medium text-slate-400">Token</th>
            <th className="px-4 py-3 text-left font-medium text-slate-400">Issuer</th>
            <th className="px-4 py-3 text-right font-medium text-slate-400">Balance</th>
            <th className="px-4 py-3 text-right font-medium text-slate-400">USD Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {tokens.map((token) => (
            <tr
              key={`${token.code}-${token.issuer}`}
              className="transition-colors hover:bg-slate-700/30"
            >
              <td className="px-4 py-3">
                <span className="font-semibold text-slate-200">{token.code}</span>
              </td>
              <td className="px-4 py-3">
                <span
                  className="font-mono text-xs text-slate-500"
                  title={token.issuer}
                >
                  {formatAddress(token.issuer)}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-slate-300">
                {formatNumber(parseFloat(token.balance), 7)}
              </td>
              <td className="px-4 py-3 text-right text-slate-500">
                {token.balanceUsd !== null ? formatUsd(token.balanceUsd) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

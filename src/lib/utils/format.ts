/**
 * Shorten a Stellar address: show first 4 + last 4 chars separated by "..."
 * e.g. GABC...WXYZ
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

/**
 * Format a number with locale-aware separators
 * @param n - the number to format
 * @param decimals - number of decimal places (default 2)
 */
export function formatNumber(n: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(n);
}

/**
 * Format a number as USD currency
 */
export function formatUsd(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

/**
 * Format XLM balance string to a readable number
 */
export function formatXlm(balance: string, decimals = 4): string {
  const n = parseFloat(balance);
  if (isNaN(n)) return '0';
  return formatNumber(n, decimals);
}

export function convertNumberToMoney(n: number): string {

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const ret = formatter.format(n);
  return ret;

}
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const date = new Intl.DateTimeFormat('es', { day: '2-digit', month: 'short', year: 'numeric' });

export const formatMoney = (n: number): string => money.format(n);
export const formatDate = (iso: string): string => date.format(new Date(iso));

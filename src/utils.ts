export const money = (n: number) => `$${n.toFixed(2)}`;

export const round2 = (n: number) => Math.round(n * 100) / 100;
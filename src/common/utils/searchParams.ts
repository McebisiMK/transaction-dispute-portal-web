export const parsePositiveInt = (value: string | null, fallback: number): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const parseOption = <T extends string>(value: string | null, options: readonly T[]): T | undefined => options.find((option) => option === value);

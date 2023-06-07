export const formatNumber = (value: number = 0, decimal: number = 0) => {
  return Number(value).toLocaleString("en-US", {
    maximumFractionDigits: decimal,
    minimumFractionDigits: decimal,
  });
};

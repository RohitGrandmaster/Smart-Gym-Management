export const getProgressColor = (used: number, limit: number) => {
  const percent = (used / limit) * 100;
  if (percent > 90) return 'bg-danger';
  if (percent > 75) return 'bg-warning';
  return 'bg-success';
};

export const getPercentage = (used: number, limit: number) => {
  return Math.min(100, (used / limit) * 100).toFixed(1);
};

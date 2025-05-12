export const timeSince = (time: Date | string) => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - new Date(time).getTime()) / 1000);

  const intervals: [number, string][] = [
    [60 * 60 * 24, "d"], // dias
    [60 * 60, "h"], // horas
    [60, "m"], // minutos
    [1, "s"], // segundos
  ];

  for (const [intervalInSeconds, unit] of intervals) {
    const amount = Math.floor(seconds / intervalInSeconds);
    if (amount >= 1) {
      return `${amount}${unit}`;
    }
  }

  return "0s";
};

export const handleGaugeSettings = (minRange, maxRange) => {
  const min = parseInt(minRange);
  const max = parseInt(maxRange);

  const step = (max - min) / 8;

  const highlightColors = [
    "#87C6FB",
    "#B1DAFC",
    "#D7EDFE",
    "#FFD5D6",
    "#FFAAAD",
    "#FF7C83",
    "#FF4458",
    "#FF002A",
  ];

  const majorTicks = [min]
  const highlights = [];

  for (let i = 0; i < 8; i++) {
    const from = min + step * i;
    const to = from + step;
    
    majorTicks.push(to)

    highlights.push({
      from: from,
      to: to,
      color: highlightColors[i],
    });
  }

  return {
    highlights,
    majorTicks
  }
};


import { OHLCVData } from '@/types';

export const generatePortfolioHistory = (
  days: number = 180,
  startValue: number = 148_000,
  endValue: number = 248_740,
): { date: string; value: number; benchmark: number }[] => {
  const data: { date: string; value: number; benchmark: number }[] = [];
  let value = startValue;
  let benchmark = startValue;
  const now = Date.now();
  const growthFactor = Math.pow(endValue / startValue, 1 / days);

  for (let i = days; i >= 0; i--) {
    const date = new Date(now - i * 86400000);
    const noise = 1 + (Math.random() - 0.48) * 0.022;
    const benchNoise = 1 + (Math.random() - 0.49) * 0.014;
    value = value * growthFactor * noise;
    benchmark = benchmark * 1.0004 * benchNoise;
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value * 100) / 100,
        benchmark: Math.round(benchmark * 100) / 100,
      });
    }
  }
  return data;
};

export const generateVolumeProfile = (ohlcv: OHLCVData[]) => {
  const priceMin = Math.min(...ohlcv.map((d) => d.low));
  const priceMax = Math.max(...ohlcv.map((d) => d.high));
  const bins = 20;
  const binSize = (priceMax - priceMin) / bins;
  const profile: { price: number; volume: number; bullVolume: number; bearVolume: number }[] = [];

  for (let i = 0; i < bins; i++) {
    const price = priceMin + i * binSize + binSize / 2;
    let volume = 0;
    let bullVolume = 0;
    let bearVolume = 0;
    ohlcv.forEach((candle) => {
      if (candle.low <= price && candle.high >= price) {
        volume += candle.volume;
        if (candle.close >= candle.open) bullVolume += candle.volume / 2;
        else bearVolume += candle.volume / 2;
      }
    });
    profile.push({ price: Math.round(price * 100) / 100, volume, bullVolume, bearVolume });
  }
  return profile;
};
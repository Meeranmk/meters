export type ConversionMode = 'm_to_ft' | 'ft_to_m';

export interface HistoryItem {
  id: string;
  timestamp: string;
  fromValue: string;
  fromUnit: string;
  toValue: string;
  toUnit: string;
}


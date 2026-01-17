type ChipVariant = 'filled' | 'outlined';

export interface ChipData {
    id: number;
    label: string;
    variant: ChipVariant;
  }
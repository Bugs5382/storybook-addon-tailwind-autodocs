import { groupTailwindColors } from './helpers';
import csf from './csf';

export const generateCsf = (tailwindConfigColors: Record<string, any>) => {
    const groupedColors = groupTailwindColors(tailwindConfigColors);
    return csf(groupedColors);
};

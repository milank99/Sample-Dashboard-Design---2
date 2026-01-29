
import { Utility, UtilityType } from '../types';
import { FALLBACK_DATA } from '../constants';

export const fetchUtilities = async (): Promise<Utility[]> => {
  try {
    const response = await fetch('utilities.csv');
    if (!response.ok) {
      console.warn('CSV file not found, falling back to internal data.');
      return FALLBACK_DATA;
    }
    
    const csvText = await response.text();
    const rows = csvText.split('\n').filter(row => row.trim().length > 0);
    
    // Skip header row
    const dataRows = rows.slice(1);
    
    return dataRows.map(row => {
      // Basic CSV parsing handling potential quotes
      const parts = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      const cleanParts = parts.map(p => p.replace(/^"|"$/g, '').trim());
      
      return {
        name: cleanParts[0] || 'Unknown',
        description: cleanParts[1] || '',
        url: cleanParts[2] || '#',
        type: (cleanParts[3] as UtilityType) || 'Analytics'
      };
    });
  } catch (error) {
    console.error('Error parsing utilities.csv:', error);
    return FALLBACK_DATA;
  }
};

// Conversion constants
export const METERS_TO_FEET_FACTOR = 3.280839895;

/**
 * Convert meters to decimal feet
 */
export function metersToFeet(m: number): number {
  return m * METERS_TO_FEET_FACTOR;
}

/**
 * Convert decimal feet to meters
 */
export function feetToMeters(ft: number): number {
  return ft / METERS_TO_FEET_FACTOR;
}


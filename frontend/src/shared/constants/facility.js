export const FACILITY_CONDITION = {
  GOOD: 'good',
  BROKEN: 'broken',
  MAINTENANCE: 'maintenance',
};

/**
 * Checks if a facility is available/active based on its condition.
 * Defaults to true if the condition is not set (null/undefined) or is 'good'.
 * @param {Object} facility
 * @returns {boolean}
 */
export const isFacilityAvailable = (facility) => {
  if (!facility) return false;
  return !facility.condition || facility.condition.toLowerCase() === FACILITY_CONDITION.GOOD;
};

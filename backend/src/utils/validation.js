const isNonEmptyString = (value) => typeof value === 'string' && value.trim() !== '';
const isPositiveInteger = (value) => Number.isInteger(value) && value > 0;

module.exports = { isNonEmptyString, isPositiveInteger };

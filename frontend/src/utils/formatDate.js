const formatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

// Format an ISO date ("2026-11-14") for display ("14 Nov 2026"). Unparseable values are shown as-is.
// Parsed and formatted in UTC so the day never shifts with the viewer's time zone.
export function formatEventDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? isoDate : formatter.format(date);
}

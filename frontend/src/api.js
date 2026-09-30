// Thin wrappers around the backend API. Requests are same-origin: the Vite dev server
// (or nginx in Docker) proxies /user, /event and /booking to the Express backend.
async function request(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'include',
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

const post = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) });

export const getSession = () => request('/user/session');
export const login = (username, password) => post('/user/login', { username, password });
export const logout = () => post('/user/logout', {});
export const searchEvents = (location) => request(`/event/${encodeURIComponent(location)}`);
export const bookTicket = ({ eventID, ticketType, quantity }) =>
  post('/booking/ticketing', { eventID, ticketType, quantity });

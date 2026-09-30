import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingForm from './BookingForm.jsx';

function mockFetchResponse(status, body) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

async function fillAndSubmit(user, { type = 'VIP', quantity = '2' } = {}) {
  if (type) await user.selectOptions(screen.getByLabelText(/ticket type/i), type);
  if (quantity) await user.type(screen.getByLabelText(/quantity/i), quantity);
  await user.click(screen.getByRole('button', { name: /book ticket/i }));
}

describe('BookingForm', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('books tickets, shows a success message and resets the form', async () => {
    const fetchMock = mockFetchResponse(200, { success: true, bookingId: 7 });
    const user = userEvent.setup();
    render(<BookingForm eventId={1} loggedInUser="demo" />);

    await fillAndSubmit(user);

    expect(await screen.findByRole('status')).toHaveTextContent('Booking successful!');
    expect(screen.getByRole('status')).toHaveClass('success');
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe('/booking/ticketing');
    expect(JSON.parse(options.body)).toEqual({ eventID: 1, ticketType: 'VIP', quantity: 2 });
    expect(screen.getByLabelText(/ticket type/i)).toHaveValue('');
    expect(screen.getByLabelText(/quantity/i)).toHaveValue(null);
  });

  it('shows the error message returned by the server', async () => {
    mockFetchResponse(409, { success: false, message: 'This ticket type is sold out or does not have enough availability.' });
    const user = userEvent.setup();
    render(<BookingForm eventId={1} loggedInUser="demo" />);

    await fillAndSubmit(user);

    const message = await screen.findByRole('status');
    expect(message).toHaveTextContent(/sold out/);
    expect(message).toHaveClass('error');
  });

  it('shows a message when the server cannot be reached', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    const user = userEvent.setup();
    render(<BookingForm eventId={1} loggedInUser="demo" />);

    await fillAndSubmit(user);

    expect(await screen.findByRole('status')).toHaveTextContent(/could not reach the server/i);
  });

  it('asks logged-out users to log in without calling the API', async () => {
    const fetchMock = mockFetchResponse(200, {});
    const user = userEvent.setup();
    render(<BookingForm eventId={1} loggedInUser={null} />);

    await fillAndSubmit(user);

    expect(screen.getByRole('status')).toHaveTextContent('You must be logged in to book.');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ['no ticket type', { type: null }],
    ['no quantity', { quantity: null }],
    ['a zero quantity', { quantity: '0' }],
  ])('validates input: %s', async (_label, input) => {
    const fetchMock = mockFetchResponse(200, {});
    const user = userEvent.setup();
    render(<BookingForm eventId={1} loggedInUser="demo" />);

    await fillAndSubmit(user, input);

    expect(screen.getByRole('status')).toHaveTextContent('Please select a ticket type and quantity.');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

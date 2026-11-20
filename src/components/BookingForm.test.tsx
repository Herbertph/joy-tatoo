import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { bookingSection } from '../data/tattooData';
import { BookingForm } from './BookingForm';

const ENDPOINT = 'https://inquiry.test/submit';
const img = (name: string, type = 'image/png', size = 1000) => {
  const f = new File(['x'], name, { type });
  Object.defineProperty(f, 'size', { value: size });
  return f;
};

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Full Name *'), 'Camille Roy');
  await user.type(screen.getByLabelText('Email Address *'), 'joy@example.com');
  await user.selectOptions(screen.getByLabelText('Tattoo Style *'), 'Fine Line');
  await user.type(screen.getByLabelText('Body Placement *'), 'Ankle');
  await user.selectOptions(screen.getByLabelText('Approximate Size *'), 'Small (2–4")');
  await user.type(screen.getByLabelText('Idea Description & Preferred Days *'), 'A tiny moon, Saturdays.');
  await user.click(screen.getByLabelText(bookingSection.ageText));
}

const submit = () => screen.getByRole('button', { name: 'SUBMIT TATTOO INQUIRY' });
const fileInput = () => screen.getByLabelText(/Reference Images \(Up to 3\)/) as HTMLInputElement;

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe('BookingForm', () => {
  it('TC-24 (AC-24): empty submit shows required errors, marks fields invalid, focuses Full Name, sends nothing', async () => {
    const user = userEvent.setup();
    render(<BookingForm endpoint={ENDPOINT} />);
    await user.click(submit());
    const required: [string, string][] = [
      ['Full Name *', 'Please enter your full name.'],
      ['Email Address *', 'Please enter a valid email address.'],
      ['Tattoo Style *', 'Please choose a tattoo style.'],
      ['Body Placement *', 'Please tell us where on your body.'],
      ['Approximate Size *', 'Please choose an approximate size.'],
      ['Idea Description & Preferred Days *', 'Please describe your idea (at least 10 characters).'],
      [bookingSection.ageText, 'You must be 18 or older to book.'],
    ];
    for (const [label, message] of required) {
      const field = screen.getByLabelText(label);
      expect(field).toHaveAttribute('aria-invalid', 'true');
      expect(field).toHaveAccessibleDescription(expect.stringContaining(message));
    }
    expect(screen.getByLabelText('Full Name *')).toHaveFocus();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('TC-46 (FR-13): re-validates touched fields on change after a submit', async () => {
    const user = userEvent.setup();
    render(<BookingForm endpoint={ENDPOINT} />);
    await user.click(submit());
    await user.type(screen.getByLabelText('Full Name *'), 'Jo');
    expect(screen.queryByText('Please enter your full name.')).not.toBeInTheDocument();
  });

  it('TC-27 (AC-27): counter shows length and the textarea stops at 2000 characters', () => {
    render(<BookingForm endpoint={ENDPOINT} />);
    expect(screen.getByLabelText('Idea Description & Preferred Days *')).toHaveAttribute('maxLength', '2000');
    expect(screen.getByText('0 / 2000')).toBeInTheDocument();
  });

  it('TC-28 (AC-28): unchecked age box blocks sending', async () => {
    const user = userEvent.setup();
    render(<BookingForm endpoint={ENDPOINT} />);
    await fillValid(user);
    await user.click(screen.getByLabelText(bookingSection.ageText));
    await user.click(submit());
    expect(screen.getByText('You must be 18 or older to book.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('TC-29/TC-31 (AC-29/AC-31): lists 3 images, rejects a 4th, and Remove frees a slot', async () => {
    const user = userEvent.setup();
    render(<BookingForm endpoint={ENDPOINT} />);
    await user.upload(fileInput(), [img('a.png'), img('b.jpg', 'image/jpeg'), img('c.png')]);
    for (const n of ['a.png', 'b.jpg', 'c.png']) expect(screen.getByText(n)).toBeInTheDocument();
    await user.upload(fileInput(), img('d.png'));
    expect(screen.getByText(/d\.png was not added/)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^Remove / })).toHaveLength(3);
    await user.click(screen.getByRole('button', { name: 'Remove b.jpg' }));
    expect(screen.queryByText('b.jpg')).not.toBeInTheDocument();
    await user.upload(fileInput(), img('d.png'));
    expect(screen.getByRole('button', { name: 'Remove d.png' })).toBeInTheDocument();
  });

  it('TC-30 (AC-30): rejects wrong type and oversize files with the file name and reason', async () => {
    const user = userEvent.setup({ applyAccept: false });
    render(<BookingForm endpoint={ENDPOINT} />);
    await user.upload(fileInput(), [img('anim.gif', 'image/gif'), img('big.jpg', 'image/jpeg', 6 * 1024 * 1024)]);
    expect(screen.getByText(/anim\.gif was not added: only PNG or JPG/)).toBeInTheDocument();
    expect(screen.getByText(/big\.jpg was not added: the file is larger than 5 MB/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Remove / })).not.toBeInTheDocument();
  });

  it('TC-32 (AC-32): sends one multipart request, shows SENDING…, then focuses the success message', async () => {
    let resolve!: (r: Response) => void;
    fetchMock.mockReturnValue(new Promise<Response>((r) => (resolve = r)));
    const user = userEvent.setup();
    render(<BookingForm endpoint={ENDPOINT} />);
    await fillValid(user);
    await user.upload(fileInput(), img('ref.png'));
    await user.click(submit());
    const sending = await screen.findByRole('button', { name: 'SENDING…' });
    expect(sending).toBeDisabled();
    await user.click(sending);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = fetchMock.mock.calls[0][1].body as FormData;
    expect(body.get('email')).toBe('joy@example.com');
    expect((body.get('referenceImages') as File).name).toBe('ref.png');
    resolve(new Response('{}', { status: 200 }));
    const success = await screen.findByText(bookingSection.success);
    await waitFor(() => expect(success).toHaveFocus());
    expect(screen.queryByRole('button', { name: 'SUBMIT TATTOO INQUIRY' })).not.toBeInTheDocument();
  });

  it.each([
    ['a 500 answer', () => Promise.resolve(new Response('', { status: 500 }))],
    ['a network failure', () => Promise.reject(new TypeError('offline'))],
  ])('TC-33 (AC-33): on %s keeps values and shows the error alert', async (_, answer) => {
    fetchMock.mockImplementation(answer);
    const user = userEvent.setup();
    render(<BookingForm endpoint={ENDPOINT} />);
    await fillValid(user);
    await user.upload(fileInput(), img('ref.png'));
    await user.click(submit());
    expect(await screen.findByRole('alert')).toHaveTextContent(bookingSection.error);
    expect(screen.getByLabelText('Full Name *')).toHaveValue('Camille Roy');
    expect(screen.getByText('ref.png')).toBeInTheDocument();
    expect(submit()).toBeEnabled();
  });

  it('TC-33 (AC-33): retrying after a failure sends a second request and shows success', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response('', { status: 500 }))
      .mockResolvedValueOnce(new Response('{}', { status: 200 }));
    const user = userEvent.setup();
    render(<BookingForm endpoint={ENDPOINT} />);
    await fillValid(user);
    await user.click(submit());
    await screen.findByRole('alert');
    await user.click(submit());
    expect(await screen.findByText(bookingSection.success)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('TC-34 (AC-34): without an endpoint shows the error and warns', async () => {
    vi.stubEnv('VITE_INQUIRY_ENDPOINT', '');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const user = userEvent.setup();
    render(<BookingForm />);
    await fillValid(user);
    await user.click(submit());
    expect(await screen.findByRole('alert')).toHaveTextContent(bookingSection.error);
    expect(screen.queryByText(bookingSection.success)).not.toBeInTheDocument();
    expect(warn).toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    warn.mockRestore();
    vi.unstubAllEnvs();
  });

  it('TC-35 (AC-35): every control has a label', () => {
    render(<BookingForm endpoint={ENDPOINT} />);
    for (const label of [
      'Full Name *',
      'Email Address *',
      'Instagram Handle or SMS Number',
      'Tattoo Style *',
      'Body Placement *',
      'Approximate Size *',
      'Budget Range',
      /Reference Images \(Up to 3\)/,
      'Idea Description & Preferred Days *',
      bookingSection.ageText,
    ]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
  });

  it('TC-41 (FR-14): dropping files on the drop zone adds them', async () => {
    render(<BookingForm endpoint={ENDPOINT} />);
    fireEvent.drop(screen.getByTestId('drop-zone'), {
      dataTransfer: { files: [img('dropped.png'), img('dropped.gif', 'image/gif')], types: ['Files'] },
    });
    expect(screen.getByRole('button', { name: 'Remove dropped.png' })).toBeInTheDocument();
    expect(screen.getByText(/dropped\.gif was not added/)).toBeInTheDocument();
  });

  it('TC-42 (FR-15): double-clicking submit sends one request', async () => {
    fetchMock.mockReturnValue(new Promise<Response>(() => {}));
    const user = userEvent.setup();
    render(<BookingForm endpoint={ENDPOINT} />);
    await fillValid(user);
    await user.dblClick(submit());
    expect(await screen.findByRole('button', { name: 'SENDING…' })).toBeDisabled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

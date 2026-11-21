import { emptyInquiry, type InquiryValues } from './inquirySchema';
import { buildInquiryFormData, submitInquiry } from './submitInquiry';

const values: InquiryValues = {
  ...emptyInquiry,
  fullName: 'Camille Roy',
  email: 'joy@example.com',
  tattooStyle: 'Fine Line',
  bodyPlacement: 'Ankle',
  approxSize: 'Tiny (1–2")',
  projectDescription: 'Small moon, weekends.',
  ageCheck: true,
};
const img = new File(['x'], 'ref.png', { type: 'image/png' });

describe('buildInquiryFormData', () => {
  it('TC-32 (AC-32): includes filled fields and images, and skips empty optional fields', () => {
    const data = buildInquiryFormData(values, [img]);
    expect(data.get('fullName')).toBe('Camille Roy');
    expect(data.get('ageCheck')).toBe('yes');
    expect(data.has('budgetRange')).toBe(false);
    expect((data.getAll('referenceImages')[0] as File).name).toBe('ref.png');
  });
});

describe('submitInquiry', () => {
  it('TC-43 (FR-13): keeps special characters and emoji in the submitted data', () => {
    const special = {
      ...values,
      fullName: 'Camille <script>alert(1)</script> 🎨',
      projectDescription: 'A tiny moon, Saturdays. <b>bold</b>',
    };
    const data = buildInquiryFormData(special, []);
    expect(data.get('fullName')).toBe('Camille <script>alert(1)</script> 🎨');
    expect(data.get('projectDescription')).toBe('A tiny moon, Saturdays. <b>bold</b>');
  });

  it('TC-32 (AC-32): posts FormData once and resolves true on 2xx', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    await expect(submitInquiry(values, [img], 'https://x.test', fetchImpl)).resolves.toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [, init] = fetchImpl.mock.calls[0];
    expect(init.method).toBe('POST');
    expect(init.body).toBeInstanceOf(FormData);
  });

  it('TC-33 (AC-33): resolves false on a server error', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('', { status: 500 }));
    await expect(submitInquiry(values, [], 'https://x.test', fetchImpl)).resolves.toBe(false);
  });

  it('TC-33 (AC-33): resolves false on a network failure', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError('offline'));
    await expect(submitInquiry(values, [], 'https://x.test', fetchImpl)).resolves.toBe(false);
  });

  it('TC-34 (AC-34): without an endpoint it fails, warns and sends nothing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fetchImpl = vi.fn();
    await expect(submitInquiry(values, [], '', fetchImpl)).resolves.toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

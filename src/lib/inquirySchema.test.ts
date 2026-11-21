import { addReferenceFiles, emptyInquiry, inquirySchema, type InquiryValues } from './inquirySchema';

const valid: InquiryValues = {
  ...emptyInquiry,
  fullName: 'Camille Roy',
  email: 'joy@example.com',
  tattooStyle: 'Fine Line',
  bodyPlacement: 'Inner Forearm',
  approxSize: 'Small (2–4")',
  projectDescription: 'A small fern, any Tuesday.',
  ageCheck: true,
};

function errorsFor(values: Partial<InquiryValues>) {
  const result = inquirySchema.safeParse({ ...valid, ...values });
  return result.success ? {} : result.error.flatten().fieldErrors;
}

const file = (name: string, type: string, size = 1000) => {
  const f = new File(['x'], name, { type });
  Object.defineProperty(f, 'size', { value: size });
  return f;
};

describe('inquirySchema', () => {
  it('accepts a valid inquiry without optional fields', () => {
    expect(inquirySchema.safeParse(valid).success).toBe(true);
  });

  it('TC-24 (AC-24): reports every required field on an empty form', () => {
    const result = inquirySchema.safeParse(emptyInquiry);
    expect(result.success).toBe(false);
    const errors = result.success ? {} : result.error.flatten().fieldErrors;
    expect(errors.fullName).toEqual(['Please enter your full name.']);
    expect(errors.email).toEqual(['Please enter a valid email address.']);
    expect(errors.tattooStyle).toEqual(['Please choose a tattoo style.']);
    expect(errors.bodyPlacement).toEqual(['Please tell us where on your body.']);
    expect(errors.approxSize).toEqual(['Please choose an approximate size.']);
    expect(errors.projectDescription).toEqual(['Please describe your idea (at least 10 characters).']);
    expect(errors.ageCheck).toEqual(['You must be 18 or older to book.']);
    expect(errors.socialContact).toBeUndefined();
    expect(errors.budgetRange).toBeUndefined();
  });

  it.each(['A', '   ', ' A '])('TC-25 (AC-25): rejects full name %j', (fullName) => {
    expect(errorsFor({ fullName }).fullName).toEqual(['Please enter your full name.']);
  });

  it.each(['joy@', 'joy.com', ''])('TC-26 (AC-26): rejects email %j', (email) => {
    expect(errorsFor({ email }).email).toEqual(['Please enter a valid email address.']);
  });

  it('TC-26 (AC-26): accepts joy@example.com', () => {
    expect(errorsFor({ email: 'joy@example.com' }).email).toBeUndefined();
  });

  it('TC-27 (AC-27): requires 10 to 2000 characters of description', () => {
    expect(errorsFor({ projectDescription: '123456789' }).projectDescription).toBeDefined();
    expect(errorsFor({ projectDescription: '1234567890' }).projectDescription).toBeUndefined();
    expect(errorsFor({ projectDescription: 'x'.repeat(2001) }).projectDescription).toBeDefined();
  });

  it('TC-28 (AC-28): requires the age confirmation', () => {
    expect(errorsFor({ ageCheck: false }).ageCheck).toEqual(['You must be 18 or older to book.']);
  });

  it('rejects the "Select a style" placeholder and unknown sizes', () => {
    expect(errorsFor({ tattooStyle: '' }).tattooStyle).toBeDefined();
    expect(errorsFor({ approxSize: 'Huge' }).approxSize).toBeDefined();
  });

  it('TC-44 (FR-13): enforces the 2–80 character boundaries for name and placement', () => {
    expect(errorsFor({ fullName: 'x'.repeat(80) }).fullName).toBeUndefined();
    expect(errorsFor({ fullName: 'x'.repeat(81) }).fullName).toEqual(['Please enter your full name.']);
    expect(errorsFor({ bodyPlacement: 'x'.repeat(80) }).bodyPlacement).toBeUndefined();
    expect(errorsFor({ bodyPlacement: 'x'.repeat(81) }).bodyPlacement).toEqual(['Please tell us where on your body.']);
  });

  it('TC-44 (FR-13): limits social contact to 60 characters', () => {
    expect(errorsFor({ socialContact: 'x'.repeat(60) }).socialContact).toBeUndefined();
    expect(errorsFor({ socialContact: 'x'.repeat(61) }).socialContact).toBeDefined();
  });
});

describe('addReferenceFiles', () => {
  it('TC-29 (AC-29): accepts up to 3 images and rejects a 4th, keeping the 3', () => {
    const three = [file('a.png', 'image/png'), file('b.jpg', 'image/jpeg'), file('c.jpeg', 'image/jpeg')];
    const first = addReferenceFiles([], three);
    expect(first.accepted).toHaveLength(3);
    expect(first.errors).toEqual([]);

    const second = addReferenceFiles(first.accepted, [file('d.png', 'image/png')]);
    expect(second.accepted).toEqual(first.accepted);
    expect(second.errors[0]).toMatch(/d\.png.*up to 3/);
  });

  it.each([
    ['anim.gif', 'image/gif'],
    ['doc.pdf', 'application/pdf'],
  ])('TC-30 (AC-30): rejects %s by type', (name, type) => {
    const { accepted, errors } = addReferenceFiles([], [file(name, type)]);
    expect(accepted).toEqual([]);
    expect(errors[0]).toContain(name);
    expect(errors[0]).toMatch(/PNG or JPG/);
  });

  it('TC-30 (AC-30): rejects a 6 MB JPG by size', () => {
    const { accepted, errors } = addReferenceFiles([], [file('big.jpg', 'image/jpeg', 6 * 1024 * 1024)]);
    expect(accepted).toEqual([]);
    expect(errors[0]).toMatch(/big\.jpg.*5 MB/);
  });
});

import type { InquiryValues } from './inquirySchema';

export function buildInquiryFormData(values: InquiryValues, files: File[]): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === 'boolean') data.append(key, value ? 'yes' : 'no');
    else if (value.trim() !== '') data.append(key, value.trim());
  }
  for (const f of files) data.append('referenceImages', f, f.name);
  return data;
}

/** Posts the inquiry. Resolves true only on a 2xx answer; never pretends to succeed without an endpoint. */
export async function submitInquiry(
  values: InquiryValues,
  files: File[],
  endpoint: string | undefined = import.meta.env.VITE_INQUIRY_ENDPOINT,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  if (!endpoint) {
    console.warn('VITE_INQUIRY_ENDPOINT is not configured; the inquiry was not sent.');
    return false;
  }
  try {
    const res = await fetchImpl(endpoint, {
      method: 'POST',
      body: buildInquiryFormData(values, files),
      headers: { Accept: 'application/json' },
    });
    return res.ok;
  } catch {
    return false;
  }
}

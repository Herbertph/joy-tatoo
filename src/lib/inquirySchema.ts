import { z } from 'zod';
import { approxSizes, budgetRanges, tattooStyles } from '../data/tattooData';

export const MAX_FILES = 3;
export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const DESCRIPTION_MAX = 2000;
const ACCEPTED_TYPES = ['image/png', 'image/jpeg'];
const ACCEPTED_EXT = /\.(png|jpe?g)$/i;

const oneOf = (list: readonly string[], message: string) =>
  z.string().refine((v) => list.includes(v), { message });

export const inquirySchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name.').max(80, 'Please enter your full name.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  socialContact: z.string().trim().max(60, 'Please keep this under 60 characters.'),
  tattooStyle: oneOf(tattooStyles, 'Please choose a tattoo style.'),
  bodyPlacement: z
    .string()
    .trim()
    .min(2, 'Please tell us where on your body.')
    .max(80, 'Please tell us where on your body.'),
  approxSize: oneOf(approxSizes, 'Please choose an approximate size.'),
  budgetRange: z.string().refine((v) => v === '' || budgetRanges.includes(v)),
  projectDescription: z
    .string()
    .trim()
    .min(10, 'Please describe your idea (at least 10 characters).')
    .max(DESCRIPTION_MAX, 'Please describe your idea (at least 10 characters).'),
  ageCheck: z.boolean().refine((v) => v, { message: 'You must be 18 or older to book.' }),
});

export type InquiryValues = z.infer<typeof inquirySchema>;

export const emptyInquiry: InquiryValues = {
  fullName: '',
  email: '',
  socialContact: '',
  tattooStyle: '',
  bodyPlacement: '',
  approxSize: '',
  budgetRange: '',
  projectDescription: '',
  ageCheck: false,
};

export interface FileCheck {
  accepted: File[];
  errors: string[];
}

/** Adds `incoming` to `current`, keeping the current files and rejecting files that break the rules. */
export function addReferenceFiles(current: File[], incoming: File[]): FileCheck {
  const accepted = [...current];
  const errors: string[] = [];
  for (const file of incoming) {
    if (!ACCEPTED_TYPES.includes(file.type) && !ACCEPTED_EXT.test(file.name)) {
      errors.push(`${file.name} was not added: only PNG or JPG images are accepted.`);
    } else if (file.size > MAX_FILE_BYTES) {
      errors.push(`${file.name} was not added: the file is larger than 5 MB.`);
    } else if (accepted.length >= MAX_FILES) {
      errors.push(`${file.name} was not added: you can attach up to ${MAX_FILES} images.`);
    } else {
      accepted.push(file);
    }
  }
  return { accepted, errors };
}

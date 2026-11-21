import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, X } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { approxSizes, bookingSection, budgetRanges, tattooStyles } from '../data/tattooData';
import {
  addReferenceFiles,
  DESCRIPTION_MAX,
  emptyInquiry,
  inquirySchema,
  type InquiryValues,
} from '../lib/inquirySchema';
import { submitInquiry } from '../lib/submitInquiry';
import { useBooking } from './BookingContext';
import { btnPrimary, Section } from './ui';

type Status = 'idle' | 'sending' | 'success' | 'error';

const control =
  'mt-2 w-full rounded-md border border-border-subtle bg-bg-primary px-4 py-3 text-text-primary placeholder:text-text-secondary transition-colors duration-200 ease-in-out hover:border-text-secondary aria-[invalid=true]:border-red-400';
const labelCls = 'block text-sm font-medium text-text-primary';

function Field({
  id,
  label,
  error,
  children,
  className = '',
}: {
  id: keyof InquiryValues;
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

export function BookingForm({ endpoint }: { endpoint?: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [files, setFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);
  const { preset } = useBooking();

  const {
    register,
    handleSubmit,
    setValue,
    getFieldState,
    watch,
    formState: { errors },
  } = useForm<InquiryValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: emptyInquiry,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (!preset) return;
    setValue(preset.field, preset.value, { shouldDirty: true, shouldValidate: !!getFieldState(preset.field).error });
  }, [preset, setValue, getFieldState]);

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const result = addReferenceFiles(files, Array.from(list));
    setFiles(result.accepted);
    setFileErrors(result.errors);
  };

  const onSubmit = async (values: InquiryValues) => {
    if (status === 'sending') return;
    setStatus('sending');
    const ok = await submitInquiry(values, files, endpoint);
    setStatus(ok ? 'success' : 'error');
  };

  const describedBy = (id: keyof InquiryValues, extra?: string) =>
    [errors[id] ? `${id}-error` : '', extra ?? ''].filter(Boolean).join(' ') || undefined;
  const a11y = (id: keyof InquiryValues, extra?: string) => ({
    id,
    'aria-invalid': errors[id] ? true : undefined,
    'aria-describedby': describedBy(id, extra),
  });

  const description = watch('projectDescription') ?? '';
  const sending = status === 'sending';

  return (
    <Section id="booking" eyebrow={bookingSection.eyebrow} heading={bookingSection.heading} text={bookingSection.text}>
      <div className="mx-auto max-w-3xl rounded-md border border-border-subtle bg-bg-secondary p-6 md:p-10">
        {status === 'success' ? (
          <div ref={successRef} tabIndex={-1} role="status" className="text-center text-lg">
            {bookingSection.success}
          </div>
        ) : (
          <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
            <Field id="fullName" label="Full Name *" error={errors.fullName?.message}>
              <input
                type="text"
                autoComplete="name"
                aria-required="true"
                className={control}
                {...a11y('fullName')}
                {...register('fullName')}
              />
            </Field>
            <Field id="email" label="Email Address *" error={errors.email?.message}>
              <input
                type="email"
                autoComplete="email"
                aria-required="true"
                className={control}
                {...a11y('email')}
                {...register('email')}
              />
            </Field>
            <Field
              id="socialContact"
              label="Instagram Handle or SMS Number"
              error={errors.socialContact?.message}
              className="md:col-span-2"
            >
              <input type="text" maxLength={60} className={control} {...a11y('socialContact')} {...register('socialContact')} />
            </Field>
            <Field id="tattooStyle" label="Tattoo Style *" error={errors.tattooStyle?.message}>
              <select aria-required="true" className={control} {...a11y('tattooStyle')} {...register('tattooStyle')}>
                <option value="">Select a style</option>
                {tattooStyles.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field id="bodyPlacement" label="Body Placement *" error={errors.bodyPlacement?.message}>
              <input
                type="text"
                maxLength={80}
                aria-required="true"
                placeholder={bookingSection.bodyPlacementPlaceholder}
                className={control}
                {...a11y('bodyPlacement')}
                {...register('bodyPlacement')}
              />
            </Field>
            <Field id="approxSize" label="Approximate Size *" error={errors.approxSize?.message}>
              <select aria-required="true" className={control} {...a11y('approxSize')} {...register('approxSize')}>
                <option value="">Select a size</option>
                {approxSizes.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field id="budgetRange" label="Budget Range" error={errors.budgetRange?.message}>
              <select className={control} {...a11y('budgetRange')} {...register('budgetRange')}>
                <option value="">Select a range</option>
                {budgetRanges.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>

            <div className="md:col-span-2">
              <label htmlFor="referenceImages" className={labelCls}>
                Reference Images (Up to 3)
              </label>
              <input
                id="referenceImages"
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                aria-describedby="referenceImages-help referenceImages-errors"
                className="peer sr-only"
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = '';
                }}
              />
              <label
                htmlFor="referenceImages"
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  addFiles(e.dataTransfer.files);
                }}
                data-testid="drop-zone"
                className={`mt-2 flex cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed p-6 text-center text-sm text-text-secondary transition-colors duration-200 ease-in-out peer-focus-visible:ring-2 peer-focus-visible:ring-accent-gold ${
                  dragging ? 'border-accent-gold bg-bg-primary' : 'border-border-subtle hover:border-accent-gold'
                }`}
              >
                <ImagePlus aria-hidden="true" size={24} className="text-accent-gold" />
                <span>
                  {bookingSection.dropZone} <span className="text-accent-gold underline">{bookingSection.chooseFiles}</span>
                </span>
              </label>
              <p id="referenceImages-help" className="mt-1.5 text-xs text-text-secondary">
                {bookingSection.fileHelper}
              </p>
              <div id="referenceImages-errors" aria-live="polite">
                {fileErrors.map((err) => (
                  <p key={err} className="mt-1.5 text-sm text-red-300">
                    {err}
                  </p>
                ))}
              </div>
              {files.length > 0 && (
                <ul aria-label="Selected images" className="mt-3 space-y-2">
                  {files.map((f, i) => (
                    <li
                      key={`${f.name}-${i}`}
                      className="flex items-center justify-between gap-3 rounded-md border border-border-subtle px-3 py-2 text-sm"
                    >
                      <span className="truncate">{f.name}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${f.name}`}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-text-secondary transition-colors duration-200 ease-in-out hover:text-text-primary"
                        onClick={() => {
                          setFiles((prev) => prev.filter((_, j) => j !== i));
                          setFileErrors([]);
                        }}
                      >
                        <X aria-hidden="true" size={14} />
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Field
              id="projectDescription"
              label="Idea Description & Preferred Days *"
              error={errors.projectDescription?.message}
              className="md:col-span-2"
            >
              <textarea
                rows={5}
                maxLength={DESCRIPTION_MAX}
                aria-required="true"
                className={control}
                {...a11y('projectDescription', 'projectDescription-count')}
                {...register('projectDescription')}
              />
              <p id="projectDescription-count" className="mt-1 text-right text-xs text-text-secondary">
                {description.length} / {DESCRIPTION_MAX}
              </p>
            </Field>

            <fieldset className="md:col-span-2">
              <legend className={labelCls}>Age Confirmation *</legend>
              <div className="mt-2 flex items-start gap-3">
                <input
                  type="checkbox"
                  aria-required="true"
                  className="mt-1 h-4 w-4 shrink-0 accent-accent-gold"
                  {...a11y('ageCheck')}
                  {...register('ageCheck')}
                />
                <label htmlFor="ageCheck" className="text-sm text-text-secondary">
                  {bookingSection.ageText}
                </label>
              </div>
              {errors.ageCheck && (
                <p id="ageCheck-error" className="mt-1.5 text-sm text-red-300">
                  {errors.ageCheck.message}
                </p>
              )}
            </fieldset>

            <div role="alert" className="md:col-span-2 empty:hidden">
              {status === 'error' && (
                <p className="rounded-md border border-red-400 p-4 text-sm text-red-200">{bookingSection.error}</p>
              )}
            </div>

            <button type="submit" disabled={sending} className={`${btnPrimary} w-full py-4 disabled:opacity-70 md:col-span-2`}>
              {sending ? bookingSection.sending : bookingSection.submit}
            </button>
          </form>
        )}
      </div>
    </Section>
  );
}

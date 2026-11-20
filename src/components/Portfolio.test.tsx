import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { portfolioItems } from '../data/tattooData';
import { Portfolio } from './Portfolio';

const cards = () => screen.getAllByRole('button', { name: /^Open / });
const fineLine = portfolioItems.filter((i) => i.category === 'fine-line');

describe('Portfolio', () => {
  it('TC-8 (AC-8): starts on "All Work" with all 8 items', () => {
    render(<Portfolio />);
    expect(screen.getByRole('button', { name: 'All Work' })).toHaveAttribute('aria-pressed', 'true');
    expect(cards()).toHaveLength(8);
  });

  it('TC-9 (AC-9): filters to Fine Line and back to All Work', async () => {
    const user = userEvent.setup();
    render(<Portfolio />);
    await user.click(screen.getByRole('button', { name: 'Fine Line' }));
    expect(cards()).toHaveLength(fineLine.length);
    for (const item of fineLine) expect(screen.getByRole('button', { name: `Open ${item.title}` })).toBeInTheDocument();
    for (const name of ['All Work', 'Black & Grey', 'Botanical & Floral', 'Traditional & Bold', 'Cover-Ups']) {
      expect(screen.getByRole('button', { name })).toHaveAttribute('aria-pressed', 'false');
    }
    expect(screen.getByRole('button', { name: 'Fine Line' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'All Work' }));
    expect(cards()).toHaveLength(8);
  });

  it('TC-10 (AC-10): shows the empty state for a category with no items', async () => {
    const user = userEvent.setup();
    render(<Portfolio items={portfolioItems.filter((i) => i.category !== 'cover-up')} />);
    await user.click(screen.getByRole('button', { name: 'Cover-Ups' }));
    expect(screen.getByText('New pieces in this style are coming soon.')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('TC-11 (AC-11): each card has its title, style and "Request Similar Style" button, revealed on hover/focus', () => {
    render(<Portfolio />);
    const info = screen.getAllByTestId('card-info')[0];
    expect(within(info).getByText(portfolioItems[0].title)).toBeInTheDocument();
    expect(within(info).getByText('Fine Line')).toBeInTheDocument();
    expect(within(info).getByRole('button', { name: 'Request Similar Style' })).toBeInTheDocument();
    expect(info.className).toMatch(/group-hover:opacity-100/);
    expect(info.className).toMatch(/group-focus-within:opacity-100/);
  });

  it('TC-13 (AC-13): clicking a card opens a dialog with title, style and session time, focus inside', async () => {
    const user = userEvent.setup();
    render(<Portfolio />);
    await user.click(cards()[0]);
    const dialog = screen.getByRole('dialog', { name: portfolioItems[0].title });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(within(dialog).getByText(`Session time: ${portfolioItems[0].sessionTime}`)).toBeInTheDocument();
    expect(within(dialog).getByText('Fine Line')).toBeInTheDocument();
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it.each(['Escape', 'close button'])('TC-14 (AC-14): closes with %s and returns focus to the card', async (how) => {
    const user = userEvent.setup();
    render(<Portfolio />);
    const card = cards()[2];
    await user.click(card);
    if (how === 'Escape') await user.keyboard('{Escape}');
    else await user.click(screen.getByRole('button', { name: 'Close' }));
    await vi.waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(card).toHaveFocus();
  });

  it('TC-14 (AC-14): closes when the backdrop is clicked', async () => {
    const user = userEvent.setup();
    render(<Portfolio />);
    await user.click(cards()[1]);
    await user.click(screen.getByTestId('lightbox-backdrop'));
    await vi.waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('TC-15 (AC-15): next from the last fine-line item wraps to the first, within the filter', async () => {
    const user = userEvent.setup();
    render(<Portfolio />);
    await user.click(screen.getByRole('button', { name: 'Fine Line' }));
    await user.click(cards()[fineLine.length - 1]);
    await user.click(screen.getByRole('button', { name: 'Next piece' }));
    expect(screen.getByRole('dialog', { name: fineLine[0].title })).toBeInTheDocument();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('dialog', { name: fineLine[fineLine.length - 1].title })).toBeInTheDocument();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('dialog', { name: fineLine[0].title })).toBeInTheDocument();
  });

  it('TC-16 (AC-16): Tab and Shift+Tab keep focus inside the dialog', async () => {
    const user = userEvent.setup();
    render(<Portfolio />);
    await user.click(cards()[0]);
    const dialog = screen.getByRole('dialog');
    for (let i = 0; i < 6; i++) {
      await user.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
    for (let i = 0; i < 6; i++) {
      await user.tab({ shift: true });
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
  });

  it('TC-45 (FR-5): rapid filter switching ends on the last selected filter', async () => {
    const user = userEvent.setup();
    render(<Portfolio />);
    for (const name of ['Black & Grey', 'Botanical & Floral', 'Cover-Ups', 'Traditional & Bold', 'All Work', 'Fine Line']) {
      await user.click(screen.getByRole('button', { name }));
    }
    expect(screen.getByRole('button', { name: 'Fine Line' })).toHaveAttribute('aria-pressed', 'true');
    for (const name of ['All Work', 'Black & Grey', 'Botanical & Floral', 'Traditional & Bold', 'Cover-Ups']) {
      expect(screen.getByRole('button', { name })).toHaveAttribute('aria-pressed', 'false');
    }
    expect(cards()).toHaveLength(fineLine.length);
  });
});

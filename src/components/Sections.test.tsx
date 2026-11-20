import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { careGuide, faqs, reviews } from '../data/tattooData';
import { CareGuide } from './CareGuide';
import { Faq } from './Faq';
import { Navbar } from './Navbar';
import { Reviews } from './Reviews';

describe('CareGuide', () => {
  it('AC-19: "Before Your Session" is selected with its four items', () => {
    render(<CareGuide />);
    expect(screen.getByRole('tab', { name: 'Before Your Session' })).toHaveAttribute('aria-selected', 'true');
    const panel = screen.getByRole('tabpanel');
    for (const item of careGuide.tabs[0].items) expect(within(panel).getByText(item.title)).toBeInTheDocument();
  });

  it('AC-20: clicking "Healing & Aftercare" swaps the content', async () => {
    const user = userEvent.setup();
    render(<CareGuide />);
    await user.click(screen.getByRole('tab', { name: 'Healing & Aftercare' }));
    expect(screen.getByRole('tab', { name: 'Healing & Aftercare' })).toHaveAttribute('aria-selected', 'true');
    const panel = screen.getByRole('tabpanel');
    for (const item of careGuide.tabs[1].items) expect(within(panel).getByText(item.title)).toBeInTheDocument();
    expect(within(panel).queryByText(careGuide.tabs[0].items[0].title)).not.toBeInTheDocument();
  });

  it('AC-20: Right arrow on the first tab selects the second', async () => {
    const user = userEvent.setup();
    render(<CareGuide />);
    screen.getByRole('tab', { name: 'Before Your Session' }).focus();
    await user.keyboard('{ArrowRight}');
    const second = screen.getByRole('tab', { name: 'Healing & Aftercare' });
    expect(second).toHaveAttribute('aria-selected', 'true');
    expect(second).toHaveFocus();
  });
});

describe('Reviews', () => {
  it('AC-21: shows three testimonials, each with one star rating label', () => {
    render(<Reviews />);
    for (const r of reviews) {
      expect(screen.getByText(r.name)).toBeInTheDocument();
      expect(screen.getByText(r.city)).toBeInTheDocument();
      expect(screen.getByText(`“${r.quote}”`)).toBeInTheDocument();
    }
    expect(screen.getAllByRole('img', { name: 'Rated 5 out of 5 stars' })).toHaveLength(3);
  });
});

describe('Faq', () => {
  it('AC-22: all 5 questions visible, all answers hidden', () => {
    render(<Faq />);
    const questions = faqs.map((f) => screen.getByRole('button', { name: f.question }));
    expect(questions).toHaveLength(5);
    for (const q of questions) expect(q).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(faqs[0].answer)).not.toBeInTheDocument();
  });

  it('AC-23: click, Enter and Space toggle answers; several can be open', async () => {
    const user = userEvent.setup();
    render(<Faq />);
    const q1 = screen.getByRole('button', { name: faqs[0].question });
    const q2 = screen.getByRole('button', { name: faqs[1].question });
    await user.click(q1);
    expect(q1).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(faqs[0].answer)).toBeInTheDocument();
    expect(document.getElementById('faq-a-0')).not.toHaveAttribute('hidden');
    q2.focus();
    await user.keyboard('{Enter}');
    expect(q2).toHaveAttribute('aria-expanded', 'true');
    expect(q1).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard(' ');
    expect(q2).toHaveAttribute('aria-expanded', 'false');
    await user.click(q1);
    expect(screen.queryByText(faqs[0].answer)).not.toBeInTheDocument();
  });
});

describe('Navbar mobile menu', () => {
  it('AC-7: picking a link closes the menu', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    const button = screen.getByRole('button', { name: 'Open menu' });
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const menu = document.getElementById('mobile-menu')!;
    await user.click(within(menu).getByRole('link', { name: 'FAQ' }));
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('AC-7: Escape closes the menu and returns focus to the button', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    const button = screen.getByRole('button', { name: 'Open menu' });
    await user.click(button);
    within(document.getElementById('mobile-menu')!).getByRole('link', { name: 'HOME' }).focus();
    await user.keyboard('{Escape}');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveFocus();
  });
});

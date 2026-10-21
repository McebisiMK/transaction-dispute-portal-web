import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import type { DisputeSummaryModel, PaginatedListOfDisputeSummaryModel } from '@/codegen/api-client';
import { renderWithProviders } from '@/test/renderWithProviders';
import { apiUrl, server } from '@/test/server';
import DisputesPage from './DisputesPage';

/* ========================================================================================= */

const buildDispute = (overrides: Partial<DisputeSummaryModel> = {}): DisputeSummaryModel => ({
  id:                   'd1',
  reference:            'DSP-2026-000101',
  transactionId:        't1',
  transactionReference: 'TXN-0001',
  merchant:             'Checkers Sea Point',
  amount:               450.25,
  currency:             'ZAR',
  transactionDate:      '2026-09-01T10:00:00Z',
  reason:               'DuplicateCharge',
  status:               'Submitted',
  submittedAt:          '2026-09-02T08:00:00Z',
  lastUpdatedAt:        '2026-09-02T08:00:00Z',
  ...overrides,
});

const buildPage = (items: DisputeSummaryModel[]): PaginatedListOfDisputeSummaryModel => ({
  items,
  pageNumber:      1,
  pageSize:        10,
  totalCount:      items.length,
  totalPages:      1,
  hasPreviousPage: false,
  hasNextPage:     false,
});

const mockDisputes = (items: DisputeSummaryModel[]) => {
  const requests: URL[] = [];
  server.use(
    http.get(apiUrl('/disputes'), ({ request }) => {
      requests.push(new URL(request.url));
      return HttpResponse.json(buildPage(items));
    }),
  );
  return requests;
};

const renderPage = () => renderWithProviders(<DisputesPage />, { path: '/disputes' });

/* ========================================================================================= */

describe('DisputesPage', () => {
  it('lists the customer disputes', async () => {
    mockDisputes([buildDispute(), buildDispute({ id: 'd2', reference: 'DSP-2026-000102', merchant: 'Uber', status: 'Approved' })]);

    renderPage();

    expect(await screen.findByText('Checkers Sea Point')).toBeInTheDocument();
    expect(screen.getByText('DSP-2026-000101')).toBeInTheDocument();
    expect(screen.getByText('Uber')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('sends the chosen status to the API and keeps it when the page is opened again', async () => {
    const requests = mockDisputes([]);
    const { unmount } = renderPage();

    await userEvent.click(await screen.findByRole('combobox', { name: 'Status' }));
    await userEvent.click(within(screen.getByRole('listbox')).getByText('Approved'));

    await waitFor(() => expect(requests.at(-1)?.searchParams.get('Status')).toBe('Approved'));
    expect(requests.at(-1)?.searchParams.get('PageNumber')).toBe('1');
    unmount();

    renderPage();

    expect(await screen.findByText('No disputes found')).toBeInTheDocument();
    expect(requests.at(-1)?.searchParams.get('Status')).toBe('Approved');
  });

  it('shows the empty state when the customer has no disputes', async () => {
    mockDisputes([]);

    renderPage();

    expect(await screen.findByText('No disputes yet')).toBeInTheDocument();
  });

  it('opens the dispute when a row is clicked', async () => {
    mockDisputes([buildDispute()]);
    const { router } = renderPage();

    await userEvent.click(await screen.findByText('Checkers Sea Point'));

    expect(router.state.location.pathname).toBe('/disputes/d1');
  });

  it('shows an error with a retry button when the API fails', async () => {
    server.use(http.get(apiUrl('/disputes'), () => new HttpResponse(null, { status: 500 })));

    renderPage();

    expect(await screen.findByText('An unexpected server error occurred. (500)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });
});

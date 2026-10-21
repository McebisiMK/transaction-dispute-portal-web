import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import type { DisputeQueueItemModel, PaginatedListOfDisputeQueueItemModel } from '@/codegen/api-client';
import { renderWithProviders } from '@/test/renderWithProviders';
import { apiUrl, server } from '@/test/server';
import DisputeQueuePage from './DisputeQueuePage';

/* ========================================================================================= */

const buildItem = (overrides: Partial<DisputeQueueItemModel> = {}): DisputeQueueItemModel => ({
  id:                   'q1',
  reference:            'DSP-2026-000101',
  customerId:           'c1',
  customerName:         'Test Customer',
  transactionReference: 'TXN-0001',
  merchant:             'Checkers Sea Point',
  amount:               450.25,
  currency:             'ZAR',
  reason:               'DuplicateCharge',
  status:               'Submitted',
  submittedAt:          '2026-09-02T08:00:00Z',
  lastUpdatedAt:        '2026-09-02T08:00:00Z',
  rowVersion:           'AAAAAAAAB9E=',
  ...overrides,
});

const buildPage = (items: DisputeQueueItemModel[]): PaginatedListOfDisputeQueueItemModel => ({
  items,
  pageNumber:      1,
  pageSize:        10,
  totalCount:      items.length,
  totalPages:      1,
  hasPreviousPage: false,
  hasNextPage:     false,
});

const mockQueue = (items: DisputeQueueItemModel[]) => {
  const requests: URL[] = [];
  server.use(
    http.get(apiUrl('/agent/disputes'), ({ request }) => {
      requests.push(new URL(request.url));
      return HttpResponse.json(buildPage(items));
    }),
  );
  return requests;
};

const renderPage = () => renderWithProviders(<DisputeQueuePage />, { path: '/agent/disputes' });

/* ========================================================================================= */

describe('DisputeQueuePage', () => {
  it('lists open disputes from every customer by default', async () => {
    const requests = mockQueue([buildItem(), buildItem({ id: 'q2', reference: 'DSP-2026-000102', customerName: 'Second Customer', status: 'UnderReview' })]);

    renderPage();

    expect(await screen.findByText('DSP-2026-000101')).toBeInTheDocument();
    expect(screen.getByText('Second Customer')).toBeInTheDocument();
    expect(screen.getByText('Under review')).toBeInTheDocument();
    expect(requests[0].searchParams.has('Status')).toBe(false);
  });

  it('filters the queue by status', async () => {
    const requests = mockQueue([buildItem()]);

    renderPage();
    await userEvent.click(await screen.findByRole('combobox', { name: 'Status' }));
    await userEvent.click(within(screen.getByRole('listbox')).getByText('Approved'));

    await waitFor(() => expect(requests.at(-1)?.searchParams.get('Status')).toBe('Approved'));
  });

  it('shows an empty queue', async () => {
    mockQueue([]);

    renderPage();

    expect(await screen.findByText('The queue is empty')).toBeInTheDocument();
  });

  it('opens a dispute for review', async () => {
    mockQueue([buildItem()]);
    const { router } = renderPage();

    await userEvent.click(await screen.findByText('Checkers Sea Point'));

    expect(router.state.location.pathname).toBe('/agent/disputes/q1');
  });
});

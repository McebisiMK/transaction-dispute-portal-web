import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import type { PaginatedListOfTransactionModel, TransactionModel } from '@/codegen/api-client';
import { renderWithProviders } from '@/test/renderWithProviders';
import { apiUrl, server } from '@/test/server';
import TransactionsPage from './TransactionsPage';

/* ========================================================================================= */

const buildTransaction = (overrides: Partial<TransactionModel> = {}): TransactionModel => ({
  id:              't1',
  accountId:       'a1',
  reference:       'TXN-0001',
  accountNumber:   '******4521',
  accountType:     'Cheque',
  amount:          450.25,
  currency:        'ZAR',
  merchant:        'Checkers Sea Point',
  category:        'Groceries',
  transactionDate: '2026-09-01T10:00:00Z',
  status:          'Posted',
  isDisputable:    true,
  openDisputeId:   null,
  ...overrides,
});

const buildPage = (items: TransactionModel[], totalCount = items.length): PaginatedListOfTransactionModel => ({
  items,
  pageNumber:      1,
  pageSize:        10,
  totalCount,
  totalPages:      Math.ceil(totalCount / 10),
  hasPreviousPage: false,
  hasNextPage:     totalCount > 10,
});

const mockTransactions = (items: TransactionModel[], totalCount?: number) => {
  const requests: URL[] = [];
  server.use(
    http.get(apiUrl('/transactions'), ({ request }) => {
      requests.push(new URL(request.url));
      return HttpResponse.json(buildPage(items, totalCount));
    }),
  );
  return requests;
};

const renderPage = () => renderWithProviders(<TransactionsPage />, { path: '/transactions' });

const selectStatus = async (status: string) => {
  await userEvent.click(await screen.findByRole('combobox', { name: 'Status' }));
  await userEvent.click(within(screen.getByRole('listbox')).getByText(status));
};

/* ========================================================================================= */

describe('TransactionsPage', () => {
  it('lists the customer transactions', async () => {
    mockTransactions([buildTransaction(), buildTransaction({ id: 't2', reference: 'TXN-0002', merchant: 'Uber', status: 'Pending', isDisputable: false })]);

    renderPage();

    expect(await screen.findByText('Checkers Sea Point')).toBeInTheDocument();
    expect(screen.getByText('TXN-0001')).toBeInTheDocument();
    expect(screen.getByText('Uber')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('shows the dispute action that fits each transaction', async () => {
    mockTransactions([
      buildTransaction(),
      buildTransaction({ id: 't2', reference: 'TXN-0002', isDisputable: false, openDisputeId: 'd9' }),
      buildTransaction({ id: 't3', reference: 'TXN-0003', status: 'Pending', isDisputable: false }),
    ]);

    renderPage();

    expect(await screen.findByRole('link', { name: 'Dispute Checkers Sea Point TXN-0001' })).toHaveAttribute('href', '/transactions/t1/dispute');
    expect(screen.getByRole('link', { name: 'View dispute for Checkers Sea Point TXN-0002' })).toHaveAttribute('href', '/disputes/d9');
    expect(screen.getByRole('button', { name: 'Dispute Checkers Sea Point TXN-0003' })).toBeDisabled();
  });

  it('explains why a pending transaction cannot be disputed', async () => {
    mockTransactions([buildTransaction({ status: 'Pending', isDisputable: false })]);

    renderPage();

    const button = await screen.findByRole('button', { name: 'Dispute Checkers Sea Point TXN-0001' });
    await userEvent.hover(button.parentElement!);

    expect(await screen.findByRole('tooltip')).toHaveTextContent("Pending transactions can be disputed once they've posted.");
  });

  it('searches once the customer stops typing', async () => {
    const requests = mockTransactions([buildTransaction()]);
    renderPage();

    await userEvent.type(await screen.findByLabelText('Search'), 'uber');

    await waitFor(() => expect(requests.at(-1)?.searchParams.get('Search')).toBe('uber'), { timeout: 2000 });
    expect(requests.filter((request) => request.searchParams.has('Search'))).toHaveLength(1);
  });

  it('goes back to the first page when the status filter changes', async () => {
    const requests = mockTransactions([buildTransaction()], 30);
    renderPage();

    await userEvent.click(await screen.findByRole('button', { name: /next page/i }));
    await waitFor(() => expect(requests.at(-1)?.searchParams.get('PageNumber')).toBe('2'));

    await selectStatus('Pending');

    await waitFor(() => expect(requests.at(-1)?.searchParams.get('Status')).toBe('Pending'));
    expect(requests.at(-1)?.searchParams.get('PageNumber')).toBe('1');
  });

  it('clears the search and filters', async () => {
    const requests = mockTransactions([buildTransaction()]);
    renderPage();

    await userEvent.type(await screen.findByLabelText('Search'), 'checkers');
    await waitFor(() => expect(requests.at(-1)?.searchParams.get('Search')).toBe('checkers'), { timeout: 2000 });
    await selectStatus('Posted');
    await waitFor(() => expect(requests.at(-1)?.searchParams.get('Status')).toBe('Posted'));

    await userEvent.click(screen.getByRole('button', { name: /clear/i }));

    await waitFor(() => expect(requests.at(-1)?.searchParams.has('Status')).toBe(false));
    expect(requests.at(-1)?.searchParams.has('Search')).toBe(false);
    expect(screen.getByLabelText('Search')).toHaveValue('');
  });

  it('requests the next page', async () => {
    const requests = mockTransactions([buildTransaction()], 25);
    renderPage();

    await userEvent.click(await screen.findByRole('button', { name: /next page/i }));

    await waitFor(() => expect(requests.at(-1)?.searchParams.get('PageNumber')).toBe('2'));
  });

  it('keeps the filters and page when the customer comes back to the page', async () => {
    const requests = mockTransactions([buildTransaction()], 30);
    const { unmount } = renderPage();

    await selectStatus('Pending');
    await userEvent.click(await screen.findByRole('button', { name: /next page/i }));
    await waitFor(() => expect(requests.at(-1)?.searchParams.get('PageNumber')).toBe('2'));
    unmount();

    renderPage();

    const status = await screen.findByRole('combobox', { name: 'Status' });
    await waitFor(() => expect(status).toHaveTextContent('Pending'));
    await waitFor(() => expect(requests.at(-1)?.searchParams.get('PageNumber')).toBe('2'));
    expect(requests.at(-1)?.searchParams.get('Status')).toBe('Pending');
  });

  it('shows the empty state when the customer has no transactions', async () => {
    mockTransactions([]);

    renderPage();

    expect(await screen.findByText('No transactions yet')).toBeInTheDocument();
  });

  it('shows a filtered empty state when nothing matches', async () => {
    mockTransactions([]);
    renderPage();

    await userEvent.type(await screen.findByLabelText('Search'), 'nothing');

    expect(await screen.findByText('No transactions found', {}, { timeout: 2000 })).toBeInTheDocument();
  });

  it('shows an error with a retry button when the API fails', async () => {
    server.use(http.get(apiUrl('/transactions'), () => new HttpResponse(null, { status: 500 })));

    renderPage();

    expect(await screen.findByText('An unexpected server error occurred. (500)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });
});

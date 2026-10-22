import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import type { CreateDisputeCommand, DisputeModel, TransactionModel } from '@/codegen/api-client';
import { renderWithProviders } from '@/test/renderWithProviders';
import { apiUrl, lookups, server } from '@/test/server';
import CreateDisputePage from './CreateDisputePage';

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

const mockTransaction = (overrides: Partial<TransactionModel> = {}) =>
  server.use(http.get(apiUrl('/transactions/t1'), () => HttpResponse.json(buildTransaction(overrides))));

const mockCreateDispute = (response: () => Response) => {
  const bodies: CreateDisputeCommand[] = [];
  server.use(
    http.post(apiUrl('/disputes'), async ({ request }) => {
      bodies.push((await request.json()) as CreateDisputeCommand);
      return response();
    }),
  );
  return bodies;
};

const renderPage = () => renderWithProviders(<CreateDisputePage />, { path: '/transactions/:id/dispute', route: '/transactions/t1/dispute' });

const chooseReason = async (reason: string) => {
  await userEvent.click(await screen.findByRole('combobox', { name: /reason/i }));
  await userEvent.click(within(screen.getByRole('listbox')).getByText(reason));
};

const submit = () => userEvent.click(screen.getByRole('button', { name: /submit dispute/i }));

/* ========================================================================================= */

describe('CreateDisputePage', () => {
  it('asks for a reason before submitting', async () => {
    mockTransaction();
    const bodies = mockCreateDispute(() => HttpResponse.json({}, { status: 201 }));

    renderPage();
    expect(await screen.findByText('Checkers Sea Point')).toBeInTheDocument();
    await submit();

    expect(screen.getByText('Choose why you are disputing this transaction.')).toBeInTheDocument();
    expect(bodies).toHaveLength(0);
  });

  it('offers the reasons from the lookups API', async () => {
    mockTransaction();
    server.use(
      http.get(apiUrl('/lookups'), () =>
        HttpResponse.json({ ...lookups, disputeReasons: [{ id: 'DuplicateCharge', name: 'Charged twice by the merchant' }] }),
      ),
    );

    renderPage();
    await userEvent.click(await screen.findByRole('combobox', { name: /reason/i }));

    const options = within(screen.getByRole('listbox')).getAllByRole('option');
    expect(options.map((option) => option.textContent)).toEqual(['Charged twice by the merchant']);
  });

  it('needs a description when the reason is Other', async () => {
    mockTransaction();
    const bodies = mockCreateDispute(() => HttpResponse.json({}, { status: 201 }));

    renderPage();
    await chooseReason('Other');
    await submit();

    expect(screen.getByText('Tell us what happened when the reason is Other.')).toBeInTheDocument();
    expect(bodies).toHaveLength(0);
  });

  it('submits the dispute and opens it', async () => {
    mockTransaction();
    const bodies = mockCreateDispute(() => HttpResponse.json({ id: 'd1', reference: 'DSP-2026-000101' } as DisputeModel, { status: 201 }));

    const { router } = renderPage();
    await chooseReason('Duplicate charge');
    await userEvent.type(screen.getByLabelText(/description/i), 'Charged twice');
    await submit();

    await waitFor(() => expect(router.state.location.pathname).toBe('/disputes/d1'));
    expect(bodies).toEqual([{ transactionId: 't1', reason: 'DuplicateCharge', description: 'Charged twice' }]);
  });

  it('shows server validation errors on the matching field', async () => {
    mockTransaction();
    mockCreateDispute(() =>
      HttpResponse.json({ title: 'One or more validation errors occurred.', status: 422, errors: { Description: ['Description is too long.'] } }, { status: 422 }),
    );

    renderPage();
    await chooseReason('Duplicate charge');
    await submit();

    expect(await screen.findByText('Description is too long.')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows a business rule error from the server', async () => {
    mockTransaction();
    mockCreateDispute(() =>
      HttpResponse.json({ title: 'Business Rule Violation', status: 409, detail: 'Transaction TXN-0001 is older than 120 days and can no longer be disputed.' }, { status: 409 }),
    );

    renderPage();
    await chooseReason('Duplicate charge');
    await submit();

    expect(await screen.findByRole('alert')).toHaveTextContent('Transaction TXN-0001 is older than 120 days and can no longer be disputed.');
  });

  it('explains why a pending transaction cannot be disputed', async () => {
    mockTransaction({ status: 'Pending', isDisputable: false });

    renderPage();

    expect(await screen.findByText("Pending transactions can be disputed once they've posted.")).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /submit dispute/i })).not.toBeInTheDocument();
  });

  it('links to the open dispute when the transaction is already disputed', async () => {
    mockTransaction({ isDisputable: false, openDisputeId: 'd9' });

    renderPage();

    expect(await screen.findByText('This transaction already has an open dispute.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view dispute/i })).toHaveAttribute('href', '/disputes/d9');
  });

  it('shows not found when the transaction does not belong to the customer', async () => {
    server.use(http.get(apiUrl('/transactions/t1'), () => HttpResponse.json({ title: 'Not Found', status: 404 }, { status: 404 })));

    renderPage();

    expect(await screen.findByText('Transaction not found')).toBeInTheDocument();
  });
});

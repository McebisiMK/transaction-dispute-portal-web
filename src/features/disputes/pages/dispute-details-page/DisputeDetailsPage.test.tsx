import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import type { DisputeModel, WithdrawDisputeRequest } from '@/codegen/api-client';
import { renderWithProviders } from '@/test/renderWithProviders';
import { apiUrl, server } from '@/test/server';
import DisputeDetailsPage from './DisputeDetailsPage';

/* ========================================================================================= */

const buildDispute = (overrides: Partial<DisputeModel> = {}): DisputeModel => ({
  id:            'd1',
  reference:     'DSP-2026-000101',
  transactionId: 't1',
  reason:        'DuplicateCharge',
  description:   'Charged twice',
  status:        'Submitted',
  submittedAt:   '2026-09-02T08:00:00Z',
  transaction: {
    id:              't1',
    reference:       'TXN-0001',
    accountNumber:   '******4521',
    accountType:     'Cheque',
    amount:          450.25,
    currency:        'ZAR',
    merchant:        'Checkers Sea Point',
    category:        'Groceries',
    transactionDate: '2026-09-01T10:00:00Z',
  },
  timeline: [{ fromStatus: null, toStatus: 'Submitted', changedBy: 'test.customer', changedAt: '2026-09-02T08:00:00Z' }],
  ...overrides,
});

const withdrawn = buildDispute({
  status:   'Withdrawn',
  timeline: [
    ...buildDispute().timeline,
    { fromStatus: 'Submitted', toStatus: 'Withdrawn', comment: 'Merchant refunded me', changedBy: 'test.customer', changedAt: '2026-09-03T08:00:00Z' },
  ],
});

const mockDispute = (dispute: DisputeModel) => server.use(http.get(apiUrl('/disputes/d1'), () => HttpResponse.json(dispute)));

const mockWithdraw = (response: () => Response) => {
  const bodies: WithdrawDisputeRequest[] = [];
  server.use(
    http.post(apiUrl('/disputes/d1/withdraw'), async ({ request }) => {
      bodies.push((await request.json()) as WithdrawDisputeRequest);
      return response();
    }),
  );
  return bodies;
};

const renderPage = () => renderWithProviders(<DisputeDetailsPage />, { path: '/disputes/:id', route: '/disputes/d1' });

const openWithdrawDialog = async () => {
  await userEvent.click(await screen.findByRole('button', { name: 'Withdraw' }));
  return screen.findByRole('dialog');
};

/* ========================================================================================= */

describe('DisputeDetailsPage', () => {
  it('shows the dispute, its transaction and timeline', async () => {
    mockDispute(buildDispute());

    renderPage();

    expect(await screen.findByRole('heading', { name: 'DSP-2026-000101' })).toBeInTheDocument();
    expect(screen.getByText('Charged twice')).toBeInTheDocument();
    expect(screen.getByText('Checkers Sea Point')).toBeInTheDocument();
    expect(screen.getByText('1 event recorded')).toBeInTheDocument();
  });

  it('only offers withdraw while the dispute is submitted', async () => {
    mockDispute(buildDispute({ status: 'UnderReview' }));

    renderPage();

    expect(await screen.findByText('Under review')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Withdraw' })).not.toBeInTheDocument();
  });

  it('withdraws the dispute with a comment', async () => {
    mockDispute(buildDispute());
    const bodies = mockWithdraw(() => HttpResponse.json(withdrawn));

    renderPage();
    const dialog = await openWithdrawDialog();
    await userEvent.type(within(dialog).getByLabelText(/comment/i), 'Merchant refunded me');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Withdraw' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(bodies).toEqual([{ comment: 'Merchant refunded me' }]);
    expect(screen.getAllByText('Withdrawn').length).toBeGreaterThan(0);
    expect(screen.getByText('Merchant refunded me')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Withdraw' })).not.toBeInTheDocument();
  });

  it('keeps the dialog open with the error when withdraw is rejected', async () => {
    mockDispute(buildDispute());
    mockWithdraw(() =>
      HttpResponse.json(
        { title: 'Business Rule Violation', status: 409, detail: 'Dispute DSP-2026-000101 is UnderReview and can only be withdrawn while it is Submitted.' },
        { status: 409 },
      ),
    );

    renderPage();
    const dialog = await openWithdrawDialog();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Withdraw' }));

    expect(await within(dialog).findByRole('alert')).toHaveTextContent('can only be withdrawn while it is Submitted.');
  });

  it('closes the dialog without withdrawing', async () => {
    mockDispute(buildDispute());
    const bodies = mockWithdraw(() => HttpResponse.json(withdrawn));

    renderPage();
    const dialog = await openWithdrawDialog();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(bodies).toHaveLength(0);
  });

  it('shows not found for a dispute that does not belong to the customer', async () => {
    server.use(http.get(apiUrl('/disputes/d1'), () => HttpResponse.json({ title: 'Not Found', status: 404 }, { status: 404 })));

    renderPage();

    expect(await screen.findByText('Dispute not found')).toBeInTheDocument();
  });
});

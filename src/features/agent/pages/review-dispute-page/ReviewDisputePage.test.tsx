import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import type { AgentDisputeModel, DisputeStatus, UpdateDisputeStatusRequest } from '@/codegen/api-client';
import { renderWithProviders } from '@/test/renderWithProviders';
import { apiUrl, server } from '@/test/server';
import ReviewDisputePage from './ReviewDisputePage';

/* ========================================================================================= */

const buildDispute = (status: DisputeStatus = 'Submitted', rowVersion = 'v1'): AgentDisputeModel => ({
  id:            'd1',
  reference:     'DSP-2026-000101',
  customerId:    'c1',
  customerName:  'Test Customer',
  customerEmail: 'test.customer@disputeportal.local',
  transactionId: 't1',
  reason:        'DuplicateCharge',
  description:   'Charged twice',
  status,
  submittedAt:   '2026-09-02T08:00:00Z',
  rowVersion,
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
});

const mockDispute = (...responses: AgentDisputeModel[]) => {
  let call = 0;
  server.use(http.get(apiUrl('/agent/disputes/d1'), () => HttpResponse.json(responses[Math.min(call++, responses.length - 1)])));
};

const mockUpdate = (response: () => Response) => {
  const bodies: UpdateDisputeStatusRequest[] = [];
  server.use(
    http.patch(apiUrl('/agent/disputes/d1/status'), async ({ request }) => {
      bodies.push((await request.json()) as UpdateDisputeStatusRequest);
      return response();
    }),
  );
  return bodies;
};

const renderPage = () => renderWithProviders(<ReviewDisputePage />, { path: '/agent/disputes/:id', route: '/agent/disputes/d1' });

/* ========================================================================================= */

describe('ReviewDisputePage', () => {
  it('shows the dispute, transaction and customer', async () => {
    mockDispute(buildDispute());

    renderPage();

    expect(await screen.findByRole('heading', { name: 'DSP-2026-000101' })).toBeInTheDocument();
    expect(screen.getByText('Checkers Sea Point')).toBeInTheDocument();
    expect(screen.getByText('test.customer@disputeportal.local')).toBeInTheDocument();
  });

  it('starts the review with the current row version', async () => {
    mockDispute(buildDispute());
    const bodies = mockUpdate(() => HttpResponse.json(buildDispute('UnderReview', 'v2')));

    renderPage();
    await userEvent.type(await screen.findByLabelText(/comment/i), 'Looking into it');
    await userEvent.click(screen.getByRole('button', { name: 'Start review' }));

    expect(await screen.findByRole('button', { name: 'Resolve dispute' })).toBeInTheDocument();
    expect(bodies).toEqual([{ status: 'UnderReview', comment: 'Looking into it', rowVersion: 'v1' }]);
  });

  it('needs an outcome and a comment to resolve', async () => {
    mockDispute(buildDispute('UnderReview'));
    const bodies = mockUpdate(() => HttpResponse.json(buildDispute('Approved')));

    renderPage();
    await userEvent.click(await screen.findByRole('button', { name: 'Resolve dispute' }));

    expect(screen.getByText('Choose whether to approve or reject the dispute.')).toBeInTheDocument();
    expect(screen.getByText('Explain the decision to the customer.')).toBeInTheDocument();
    expect(bodies).toHaveLength(0);
  });

  it('resolves the dispute', async () => {
    mockDispute(buildDispute('UnderReview'));
    const bodies = mockUpdate(() => HttpResponse.json(buildDispute('Rejected', 'v2')));

    renderPage();
    await userEvent.click(await screen.findByRole('radio', { name: 'Reject' }));
    await userEvent.type(screen.getByLabelText(/comment/i), 'Merchant records show one charge');
    await userEvent.click(screen.getByRole('button', { name: 'Resolve dispute' }));

    expect(await screen.findByText('This dispute is rejected. No further action is needed.')).toBeInTheDocument();
    expect(bodies).toEqual([{ status: 'Rejected', comment: 'Merchant records show one charge', rowVersion: 'v1' }]);
  });

  it('reloads the dispute and explains when someone else changed it first', async () => {
    mockDispute(buildDispute('UnderReview'), buildDispute('Approved', 'v3'));
    mockUpdate(() => HttpResponse.json({ title: 'Conflict', status: 409, detail: 'The record was modified by another request.' }, { status: 409 }));

    renderPage();
    await userEvent.click(await screen.findByRole('radio', { name: 'Reject' }));
    await userEvent.type(screen.getByLabelText(/comment/i), 'No duplicate found');
    await userEvent.click(screen.getByRole('button', { name: 'Resolve dispute' }));

    await waitFor(() => expect(screen.getByText('This dispute is approved. No further action is needed.')).toBeInTheDocument());
    expect(screen.getByText(/someone else updated this dispute/i)).toBeInTheDocument();
  });

  it('shows no actions once the dispute is closed', async () => {
    mockDispute(buildDispute('Withdrawn'));

    renderPage();

    expect(await screen.findByText('This dispute is withdrawn. No further action is needed.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /start review|resolve dispute/i })).not.toBeInTheDocument();
  });
});

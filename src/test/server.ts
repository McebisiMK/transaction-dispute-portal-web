import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import type { LookupsModel } from '@/codegen/api-client';
import { API_CONFIG } from '@/config-global';

/* ========================================================================================= */

export const apiUrl = (path: string): string => `${API_CONFIG.BASE_URL}/api/v1${path}`;

export const lookups: LookupsModel = {
  disputeReasons: [
    { id: 'UnauthorisedTransaction',    name: 'Unauthorised transaction' },
    { id: 'DuplicateCharge',            name: 'Duplicate charge' },
    { id: 'IncorrectAmount',            name: 'Incorrect amount' },
    { id: 'GoodsOrServicesNotReceived', name: 'Goods or services not received' },
    { id: 'NotAsDescribed',             name: 'Not as described' },
    { id: 'CancelledSubscription',      name: 'Cancelled subscription' },
    { id: 'RefundNotReceived',          name: 'Refund not received' },
    { id: 'Other',                      name: 'Other' },
  ],
  disputeStatuses: [
    { id: 'Submitted',   name: 'Submitted' },
    { id: 'UnderReview', name: 'Under review' },
    { id: 'Approved',    name: 'Approved' },
    { id: 'Rejected',    name: 'Rejected' },
    { id: 'Withdrawn',   name: 'Withdrawn' },
  ],
  transactionStatuses: [
    { id: 'Pending', name: 'Pending' },
    { id: 'Posted',  name: 'Posted' },
  ],
};

export const server = setupServer(http.get(apiUrl('/lookups'), () => HttpResponse.json(lookups)));

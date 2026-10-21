import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import type { AccountType, DisputeTransactionModel } from '@/codegen/api-client';
import { formatCurrency, formatDateTime } from '@/common/utils/format';
import { DetailCard } from '../detail-card';
import { DetailRow } from '../detail-row';
import { CopyableCode } from '../copyable-code';

/* ==================================================================================== */

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  Cheque:     'Cheque',
  Savings:    'Savings',
  CreditCard: 'Credit card',
};

const getInitials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

interface TransactionSummaryCardProps {
  transaction: DisputeTransactionModel;
}

const TransactionSummaryCard = ({ transaction }: TransactionSummaryCardProps) => (
  <DetailCard title="Transaction" icon={<ReceiptLongOutlinedIcon />} iconColor="success">
    <DetailRow
      label="Merchant"
      value={
        <>
          <Avatar
            variant="rounded"
            sx={{
              width: 24,
              height: 24,
              fontSize: 11,
              fontWeight: 700,
              color: 'secondary.main',
              bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.16),
            }}
          >
            {getInitials(transaction.merchant)}
          </Avatar>
          {transaction.merchant}
        </>
      }
    />
    <DetailRow
      label="Amount"
      value={
        <Typography variant="h6" component="span" sx={{ fontWeight: 700, color: 'success.main', whiteSpace: 'nowrap' }}>
          {formatCurrency(transaction.amount, transaction.currency)}
        </Typography>
      }
    />
    <DetailRow label="Date" value={formatDateTime(transaction.transactionDate)} />
    <DetailRow label="Reference" value={<CopyableCode value={transaction.reference} />} />
    <DetailRow
      label="Account"
      value={
        <>
          <CreditCardOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          {ACCOUNT_TYPE_LABELS[transaction.accountType]} · {transaction.accountNumber}
        </>
      }
    />
    <DetailRow
      label="Category"
      value={<Chip size="small" color="info" variant="outlined" label={transaction.category} sx={{ fontWeight: 600 }} />}
    />
  </DetailCard>
);

/* ==================================================================================== */

export default TransactionSummaryCard;

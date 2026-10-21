import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { TransactionModel } from '@/codegen/api-client';
import { ACCOUNT_TYPE_LABELS } from '@/common/constants/accounts';
import { formatCurrency, formatDate } from '@/common/utils/format';
import { TransactionStatusChip } from '../../transaction-status-chip';
import { TransactionDisputeCell } from './transaction-dispute-cell';
import { TRANSACTION_CATEGORY_LABELS } from '../../../constants';

/* ==================================================================================== */

interface TransactionTableRowProps {
  transaction: TransactionModel;
}

const TransactionTableRow = ({ transaction }: TransactionTableRowProps) => (
  <TableRow hover>
    <TableCell>
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
          {transaction.merchant}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {transaction.reference}
        </Typography>
      </Box>
    </TableCell>

    <TableCell>
      <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
        {formatDate(transaction.transactionDate)}
      </Typography>
    </TableCell>

    <TableCell>
      <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
        {ACCOUNT_TYPE_LABELS[transaction.accountType]} · {transaction.accountNumber}
      </Typography>
    </TableCell>

    <TableCell>
      <Typography variant="body2">{TRANSACTION_CATEGORY_LABELS[transaction.category]}</Typography>
    </TableCell>

    <TableCell align="right">
      <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
        {formatCurrency(transaction.amount, transaction.currency)}
      </Typography>
    </TableCell>

    <TableCell align="center">
      <TransactionStatusChip status={transaction.status} />
    </TableCell>

    <TableCell align="right">
      <TransactionDisputeCell transaction={transaction} />
    </TableCell>
  </TableRow>
);

/* ==================================================================================== */

export default TransactionTableRow;

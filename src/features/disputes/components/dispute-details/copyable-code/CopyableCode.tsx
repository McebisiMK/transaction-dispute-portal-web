import { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { insetSx } from '../../../styles';

/* ==================================================================================== */

interface CopyableCodeProps {
  value: string;
}

const CopyableCode = ({ value }: CopyableCodeProps) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be blocked (e.g. insecure context); the value is still selectable.
    }
  };

  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      <Box
        component="code"
        sx={[{ fontFamily: 'monospace', fontWeight: 600, letterSpacing: 0.5, px: 1, py: 0.25, borderRadius: 0.75 }, insetSx]}
      >
        {value}
      </Box>
      <Tooltip title={copied ? 'Copied' : 'Copy'}>
        <IconButton size="small" onClick={copy} aria-label={`Copy ${value}`} sx={{ color: copied ? 'success.main' : 'text.secondary' }}>
          {copied ? <CheckIcon sx={{ fontSize: 16 }} /> : <ContentCopyIcon sx={{ fontSize: 16 }} />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

/* ==================================================================================== */

export default CopyableCode;

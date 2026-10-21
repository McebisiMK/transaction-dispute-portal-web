import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import RefreshIcon from "@mui/icons-material/Refresh";

/* ======================================================================== */

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

const ErrorFallback = ({ error, onReset }: ErrorFallbackProps) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      gap: 2,
      py: 8,
      textAlign: "center",
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 700 }}>
      Something went wrong
    </Typography>

    {error?.message && (
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
        {error.message}
      </Typography>
    )}

    <Button variant="outlined" startIcon={<RefreshIcon />} onClick={onReset}>
      Try again
    </Button>
  </Box>
);

/* ======================================================================== */

export default ErrorFallback;

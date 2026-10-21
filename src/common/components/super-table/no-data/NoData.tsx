import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import Stack from "@mui/material/Stack";

/*=========================================================*/

export interface NoDataAction {
  label: string;
  onClick: () => void;
  variant: "primary" | "secondary";
  icon?: string;
}

export interface NoDataProps {
  icon?: string;
  message?: string;
  description?: string;
  actions?: NoDataAction[];
}

const NoData = ({
  icon = "inbox",
  message = "No data found",
  description = "There's nothing here yet.",
  actions = [],
}: NoDataProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: 420,
        pt: 6,
        gap: 2,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f3f6fa",
          borderRadius: 2,
          p: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Icon sx={{ fontSize: 96, color: "#a3adc2", lineHeight: 1 }}>
          {icon}
        </Icon>
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 700, color: "#222e3a" }}>
        {message}
      </Typography>

      <Typography sx={{ color: "#6b7a99", maxWidth: 420 }}>
        {description}
      </Typography>

      {actions.length > 0 && (
        <Stack
          direction="row"
          sx={{ gap: 2, flexWrap: "wrap", justifyContent: "center", mt: 1 }}
        >
          {actions.map((action, i) => (
            <Button
              key={i}
              variant="contained"
              onClick={action.onClick}
              startIcon={action.icon ? <Icon>{action.icon}</Icon> : undefined}
              sx={
                action.variant === "secondary"
                  ? {
                      fontWeight: 600,
                      px: 3.5,
                      py: 1.25,
                      borderRadius: 2,
                      bgcolor: "#e5eaf2",
                      color: "#222e3a",
                      boxShadow: "none",
                      "&:hover": { bgcolor: "#d0d7e6", boxShadow: "none" },
                    }
                  : { fontWeight: 600, px: 3.5, py: 1.25, borderRadius: 2 }
              }
            >
              {action.label}
            </Button>
          ))}
        </Stack>
      )}
    </Box>
  );
};

/*=========================================================*/

export default NoData;

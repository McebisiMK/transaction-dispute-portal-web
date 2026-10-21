import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/* ====================================================================================== */

export interface MyProfileProps {
  name: string;
  email: string;
  avatarUrl?: string;
}

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const MyProfile = ({ name, email, avatarUrl }: MyProfileProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        py: 3,
        px: 2,
        textAlign: "center",
      }}
    >
      <Avatar
        src={avatarUrl}
        alt={name}
        sx={{
          width: 72,
          height: 72,
          bgcolor: "primary.main",
          fontSize: "1.5rem",
          fontWeight: 700,
          mb: 0.5,
        }}
      >
        {!avatarUrl && getInitials(name)}
      </Avatar>

      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 700, lineHeight: 1.2, color: "text.primary" }}
      >
        {name}
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ lineHeight: 1.3 }}
      >
        {email}
      </Typography>
    </Box>
  );
};

/* ====================================================================================== */

export default MyProfile;

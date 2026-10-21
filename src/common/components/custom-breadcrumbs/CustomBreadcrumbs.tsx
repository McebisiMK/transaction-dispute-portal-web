import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { LinkItem } from "./link-item";
import { Separator } from "./separator";
import type { CustomBreadcrumbsProps } from "./types";

/* =========================================================================================================================== */

const CustomBreadcrumbs = ({ links, action, heading, moreLink, activeLast, sx, ...other }: CustomBreadcrumbsProps) => {
  const lastLink = links[links.length - 1].name;

  return (
    <Box sx={{ ...sx }}>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Box sx={{ flexGrow: 1 }}>
          {heading && (
            <Typography variant="h5" sx={{ mb: 0.25, fontWeight: 700 }}>
              {heading}
            </Typography>
          )}

          {!!links.length && (
            <Breadcrumbs separator={<Separator />} {...other}>
              {links.map((link) => (
                <LinkItem
                  key={link.name || ""}
                  link={link}
                  activeLast={activeLast}
                  disabled={link.name === lastLink}
                />
              ))}
            </Breadcrumbs>
          )}
        </Box>

        {action && <Box sx={{ flexShrink: 0 }}> {action} </Box>}
      </Box>

      {!!moreLink && (
        <Box sx={{ mt: 2 }}>
          {moreLink.map((href) => (
            <Link
              noWrap
              key={href}
              href={href}
              variant="body2"
              target="_blank"
              rel="noopener"
              sx={{ display: "table" }}
            >
              {href}
            </Link>
          ))}
        </Box>
      )}
    </Box>
  );
};

/* =========================================================================================================================== */

export default CustomBreadcrumbs;

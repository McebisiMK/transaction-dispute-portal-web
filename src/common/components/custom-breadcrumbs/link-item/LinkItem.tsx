import { Box, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { BreadcrumbsLinkProps } from '../types';

/* =========================================================================== */

type Props = {
  link: BreadcrumbsLinkProps;
  activeLast?: boolean;
  disabled: boolean;
};

const BreadcrumbsLink = ({ link, activeLast, disabled }: Props) => {
  const { name, href, icon } = link;

  const styles = {
    typography: 'body2',
    alignItems: 'center',
    color: 'text.primary',
    display: 'inline-flex',
    ...(disabled &&
      !activeLast && {
        cursor: 'default',
        pointerEvents: 'none',
        color: 'text.secondary'
      })
  };

  const renderContent = (
    <>
      {icon && (
        <Box
          component="span"
          sx={{
            mr: 1,
            display: 'inherit',
            '& svg': { width: 20, height: 20 }
          }}
        >
          {icon}
        </Box>
      )}

      {name}
    </>
  );

  if (href) {
    return (
      <Link component={RouterLink} to={href} sx={styles}>
        {renderContent}
      </Link>
    );
  }

  return <Box sx={styles}> {renderContent} </Box>;
};

/* =========================================================================== */

export default BreadcrumbsLink;

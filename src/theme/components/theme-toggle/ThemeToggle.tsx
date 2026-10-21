import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useAppTheme } from '../../context/ThemeContext';

/* ================================================================================================================================ */

interface ThemeToggleProps {
  iconOnly?: boolean;
}

/** Pill-style segmented toggle between light and dark themes. */
const ThemeToggle = ({ iconOnly = false }: ThemeToggleProps) => {
  const { themeId, setThemeId } = useAppTheme();

  if (iconOnly) {
    const next = themeId === 'light' ? 'dark' : 'light';
    const label = `Switch to ${next} mode`;
    return (
      <Tooltip title={label} placement="right">
        <IconButton
          onClick={() => setThemeId(next)}
          aria-label={label}
          size="small"
          sx={{ color: 'text.primary' }}
        >
          {next === 'dark' ? (
            <DarkModeIcon fontSize="small" />
          ) : (
            <LightModeIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Box
      sx={{
        display:      'inline-flex',
        border:       '1px solid',
        borderColor:  'divider',
        borderRadius: '999px',
        overflow:     'hidden',
        bgcolor:      'action.selected',
      }}
    >
      {(['light', 'dark'] as const).map((id) => {
        const active = themeId === id;
        return (
          <ButtonBase
            key={id}
            onClick={() => setThemeId(id)}
            aria-pressed={active}
            aria-label={`Switch to ${id} mode`}
            sx={{
              px:           2,
              py:           1,
              gap:          0.75,
              display:      'flex',
              alignItems:   'center',
              fontSize:     '0.6875rem',
              fontWeight:   600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              borderRadius: '999px',
              color:        active ? 'primary.contrastText' : 'text.secondary',
              bgcolor:      active ? 'primary.main' : 'transparent',
              transition:   'background-color 0.2s, color 0.2s',
              '&:hover':    { bgcolor: active ? 'primary.dark' : 'action.hover' },
            }}
          >
            {id === 'light' ? (
              <LightModeIcon sx={{ fontSize: 16 }} />
            ) : (
              <DarkModeIcon sx={{ fontSize: 16 }} />
            )}
            {id}
          </ButtonBase>
        );
      })}
    </Box>
  );
};

/* ================================================================================================================================ */

export default ThemeToggle;

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enZA } from "date-fns/locale";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { AuthProvider as OidcProvider } from "react-oidc-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { AppThemeProvider, ThemeSettings } from "@/theme";
import { AppRouter } from "@/AppRouter";
import { QueryErrorHandler } from "@/common/components/query-error-handler";
import { oidcConfig, AuthProvider, ApiClientProvider } from "@/common/auth";
import DialogProvider from "@/common/components/dialogs";
import { queryClient } from "@/lib/queryClient";

/* ========================================================================================= */

const App = () => {
  return (
    <OidcProvider {...oidcConfig}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enZA}>
        <AppThemeProvider>
          <ThemeSettings>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <QueryErrorHandler />
              <AuthProvider>
                <ApiClientProvider>
                  <QueryClientProvider client={queryClient}>
                    <HelmetProvider>
                      <DialogProvider>
                        <RouterProvider router={AppRouter} />
                      </DialogProvider>
                    </HelmetProvider>
                  </QueryClientProvider>
                </ApiClientProvider>
              </AuthProvider>
            </SnackbarProvider>
          </ThemeSettings>
        </AppThemeProvider>
      </LocalizationProvider>
    </OidcProvider>
  );
};

/* ========================================================================================= */

export default App;

/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout, PageLoader } from "@/common/components/layout";
import { ErrorBoundary } from "@/common/components/error-boundary";
import { ROLES } from "@/config-global";
import { AuthGuard } from "./common/auth";

/* ======================================================================== */

const NotFoundPage       = lazy(() => import("@/common/pages/not-found-page").then((m) => ({ default: m.NotFoundPage })));
const TransactionsPage   = lazy(() => import("@/features/transactions/pages/transactions-page").then((m) => ({ default: m.TransactionsPage })));
const DisputesPage       = lazy(() => import("@/features/disputes/pages/disputes-page").then((m) => ({ default: m.DisputesPage })));
const DisputeDetailsPage = lazy(() => import("@/features/disputes/pages/dispute-details-page").then((m) => ({ default: m.DisputeDetailsPage })));

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/transactions" replace />,
      },
      {
        path: "transactions",
        element: (
          <AuthGuard requiredRoles={[ROLES.CUSTOMER]}>
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <TransactionsPage />
              </Suspense>
            </ErrorBoundary>
          </AuthGuard>
        ),
      },
      {
        path: "disputes",
        element: (
          <AuthGuard requiredRoles={[ROLES.CUSTOMER]}>
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <DisputesPage />
              </Suspense>
            </ErrorBoundary>
          </AuthGuard>
        ),
      },
      {
        path: "disputes/:id",
        element: (
          <AuthGuard requiredRoles={[ROLES.CUSTOMER]}>
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <DisputeDetailsPage />
              </Suspense>
            </ErrorBoundary>
          </AuthGuard>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

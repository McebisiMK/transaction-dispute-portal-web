/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppLayout, PageLoader } from "@/common/components/layout";
import { ErrorBoundary } from "@/common/components/error-boundary";
import { ROLES } from "@/config-global";
import { AuthGuard, HomeRedirect } from "./common/auth";

/* ======================================================================== */

const NotFoundPage       = lazy(() => import("@/common/pages/not-found-page").then((m) => ({ default: m.NotFoundPage })));
const TransactionsPage   = lazy(() => import("@/features/transactions/pages/transactions-page").then((m) => ({ default: m.TransactionsPage })));
const CreateDisputePage  = lazy(() => import("@/features/disputes/pages/create-dispute-page").then((m) => ({ default: m.CreateDisputePage })));
const DisputesPage       = lazy(() => import("@/features/disputes/pages/disputes-page").then((m) => ({ default: m.DisputesPage })));
const DisputeQueuePage   = lazy(() => import("@/features/agent/pages/dispute-queue-page").then((m) => ({ default: m.DisputeQueuePage })));
const ReviewDisputePage  = lazy(() => import("@/features/agent/pages/review-dispute-page").then((m) => ({ default: m.ReviewDisputePage })));
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
        element: <HomeRedirect />,
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
        path: "transactions/:id/dispute",
        element: (
          <AuthGuard requiredRoles={[ROLES.CUSTOMER]}>
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <CreateDisputePage />
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
        path: "agent/disputes",
        element: (
          <AuthGuard requiredRoles={[ROLES.AGENT]}>
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <DisputeQueuePage />
              </Suspense>
            </ErrorBoundary>
          </AuthGuard>
        ),
      },
      {
        path: "agent/disputes/:id",
        element: (
          <AuthGuard requiredRoles={[ROLES.AGENT]}>
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <ReviewDisputePage />
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

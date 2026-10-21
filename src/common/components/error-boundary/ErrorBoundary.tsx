import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { ErrorFallback } from "./error-fallback";

/* ======================================================================== */

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <ErrorFallback error={this.state.error} onReset={this.reset} />
      );
    }
    return this.props.children;
  }
}

/* ======================================================================== */

export default ErrorBoundary;

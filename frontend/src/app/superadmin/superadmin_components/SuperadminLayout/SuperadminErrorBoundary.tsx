'use client';
// RESPONSIBILITY: SuperadminErrorBoundary.tsx acts as the typed React Error Boundary for the Superadmin module.

import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class SuperadminErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(_error: Error, _errorInfo: React.ErrorInfo) {
    // Intentionally suppressed: errors are surfaced via the fallback UI.
    // Wire up an external error reporting service (e.g. Sentry) here when available.
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-96 p-8 bg-card border border-border rounded-xl">
          <div className="w-16 h-16 bg-danger-bg rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-danger" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Something went wrong in the SaaS Panel</h2>
          <p className="text-secondary text-sm max-w-md text-center mb-6">
            {this.state.error?.message || 'An unexpected error occurred while rendering this module.'}
          </p>
          <button
            onClick={this.resetErrorBoundary}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium motion-safe:transition-colors shadow-lg"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

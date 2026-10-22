// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Typed Error Boundary component that wraps the login client components and displays a module-specific fallback UI on crash.
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AuthUrlConfig } from '@/app/auth/auth_url_config';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class LoginErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Login module error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-96 flex flex-col items-center justify-center p-8 text-center bg-card rounded-2xl shadow-lg border border-border">
          <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mb-4 text-3xl font-black">!</div>
          <h2 className="text-xl font-bold text-primary mb-2">Login Component Failed</h2>
          <p className="text-secondary mb-6 text-sm max-w-sm">We encountered an unexpected error while loading the login interface.</p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = AuthUrlConfig.PAGES.LOGIN;
            }}
            className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors"
          >
            Reload Login
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}


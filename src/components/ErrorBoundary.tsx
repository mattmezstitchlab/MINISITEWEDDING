import React, { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Captured in ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-6 my-6 mx-auto max-w-xl rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 text-center font-mono text-xs">
            <p className="font-bold mb-2">Une erreur d’affichage est survenue :</p>
            <p className="bg-white/80 p-3 rounded-lg text-left overflow-x-auto whitespace-pre-wrap">
              {this.state.error?.message || 'Erreur inconnue'}
              {'\n\n'}
              {this.state.error?.stack}
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected rendering error occurred.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('AeroBlind AI UI ErrorBoundary caught an error:', error, info);
  }

  handleRecover = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="mx-auto my-12 max-w-2xl rounded-xl border border-[#D9B8B8] bg-white p-8 text-[#101D2B]"
        >
          <div className="flex items-center gap-3 text-[#9E3B3B]">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <h2 className="font-display text-lg font-semibold text-[#101D2B]">
              Visualization Section Unavailable
            </h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#475569]">
            A display component encountered an unexpected error ({this.state.errorMessage}).
            You can retry rendering this section without reloading the page.
          </p>
          <button
            type="button"
            onClick={this.handleRecover}
            className="mt-5 inline-flex min-h-[40px] items-center gap-2 rounded-md bg-[#147D80] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0F6568] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101D2B]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retry Section
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

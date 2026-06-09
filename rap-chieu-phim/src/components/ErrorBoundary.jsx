import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <span className="material-symbols-outlined text-6xl text-[#E50914] mb-4">error_outline</span>
          <h2 className="text-xl font-bold text-on-surface mb-2">Đã xảy ra lỗi</h2>
          <p className="text-secondary mb-6 text-center max-w-md">
            {this.props.message || 'Có lỗi xảy ra khi tải trang này. Vui lòng thử lại sau.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="bg-[#E50914] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-700 transition-colors"
          >
            Tải lại trang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

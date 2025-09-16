import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ToastContainer } from "react-toastify";
import ErrorFallback from "../common/ErrorFallback";
import "./styles/AppLoading.css";

const AppLoading = ({ renderNavbar, Footer, logoImage, toastConfig }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="app-partial-loading">
        {renderNavbar()}
        <main className="app-loading-main">
          <div className="app-loading-container">
            <div className="content-loading-skeleton">
              {/* Title skeleton */}
              <div className="skeleton skeleton-title"></div>

              {/* Subtitle skeleton */}
              <div className="skeleton skeleton-subtitle"></div>

              {/* Grid of content skeletons */}
              <div className="skeleton-grid">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="skeleton-card">
                    <div className="skeleton skeleton-image"></div>
                    <div className="skeleton skeleton-text-primary"></div>
                    <div className="skeleton skeleton-text-secondary"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <Suspense fallback={<div className="footer-skeleton" />}>
          <Footer logoImage={logoImage} />
        </Suspense>
      </div>

      <ToastContainer {...toastConfig} />
    </ErrorBoundary>
  );
};

export default AppLoading;

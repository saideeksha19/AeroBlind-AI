import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class IntersectionObserverStub implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '0px';
  readonly scrollMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

if (typeof window !== 'undefined') {
  if (!window.ResizeObserver) {
    window.ResizeObserver = ResizeObserverStub;
  }
  if (!window.IntersectionObserver) {
    window.IntersectionObserver = IntersectionObserverStub;
  }

  if (!window.matchMedia) {
    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList;
  }

  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }

  // Minimal 2D context stub for AtmosphericCanvas in jsdom
  HTMLCanvasElement.prototype.getContext = (() => {
    return {
      clearRect: () => {},
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      arc: () => {},
      stroke: () => {},
      fill: () => {},
      setTransform: () => {},
      strokeStyle: '',
      fillStyle: '',
      lineWidth: 1,
    };
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}

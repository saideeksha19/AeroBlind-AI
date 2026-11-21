import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { label: 'Overview', href: '#overview' },
  { label: 'Intelligence', href: '#intelligence' },
  { label: 'Research', href: '#research' },
  { label: 'Methodology', href: '#methodology' },
  { label: 'Experiments', href: '#experiments' },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#DCE0D8] bg-[#F7F7F3]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#hero"
          className="font-display text-lg font-semibold tracking-tight text-[#101D2B] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D80] rounded-sm"
        >
          AEROBLIND AI
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#475569]"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-1 transition-colors duration-150 hover:text-[#147D80] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D80] rounded-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#research"
            className="hidden sm:inline-flex min-h-[40px] items-center justify-center rounded-md bg-[#147D80] px-4 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-[#0F6568] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101D2B]"
          >
            Explore Research
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-primary-nav"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-md border border-[#D4D8CF] bg-white text-[#101D2B] transition-colors hover:border-[#147D80] md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D80]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-primary-nav"
          aria-label="Mobile navigation"
          className="border-t border-[#DCE0D8] bg-white px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-1.5">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className="flex min-h-[44px] items-center rounded-md px-3 text-sm font-medium text-[#101D2B] transition-colors hover:bg-[#F7F7F3] hover:text-[#147D80]"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#research"
              onClick={handleLinkClick}
              className="mt-2 flex min-h-[44px] items-center justify-center rounded-md bg-[#147D80] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0F6568]"
            >
              Explore Research
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

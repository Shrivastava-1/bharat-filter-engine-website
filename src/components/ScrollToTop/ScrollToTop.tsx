import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets the window scroll position whenever the route changes.
 * - URL has a hash (#section): scroll to that element if it exists.
 * - Otherwise: scroll to the top (0, 0).
 *
 * useLayoutEffect runs after the new route's DOM is committed but before the
 * browser paints, so the reset happens without a visible jump.
 * The effect is idempotent, so React StrictMode's double invocation is harmless.
 * Query-string-only changes do not trigger a reset.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

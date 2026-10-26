const DEBUG_PARAMS = ['delay', 'fail'] as const;

export function debugSearchParams(search: string): URLSearchParams {
  const page = new URLSearchParams(search);
  const forwarded = new URLSearchParams();
  for (const key of DEBUG_PARAMS) {
    const value = page.get(key);
    if (value) forwarded.set(key, value);
  }
  return forwarded;
}

/** Drops `fail` from the page URL, so the next request succeeds, and returns the params left. */
export function clearSimulatedFailure(): URLSearchParams {
  const url = new URL(window.location.href);
  url.searchParams.delete('fail');
  window.history.replaceState(window.history.state, '', url);
  return debugSearchParams(url.search);
}

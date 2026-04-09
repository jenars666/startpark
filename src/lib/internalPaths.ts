export function getSingleSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function sanitizeInternalPath(path: string | null | undefined, fallback: string = '/') {
  if (!path || typeof path !== 'string') {
    return fallback;
  }

  if (!path.startsWith('/') || path.startsWith('//')) {
    return fallback;
  }

  try {
    const normalizedUrl = new URL(path, 'https://starmenspark.local');
    const normalizedPath = `${normalizedUrl.pathname}${normalizedUrl.search}${normalizedUrl.hash}`;

    if (normalizedUrl.pathname === '/login' || normalizedUrl.pathname === '/register') {
      return fallback;
    }

    return normalizedPath || fallback;
  } catch {
    return fallback;
  }
}

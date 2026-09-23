/**
 * Generate a breadcrumb string from a pathname
 * @param {string} pathname - Current route path
 * @param {string} prefix - Optional prefix (default: 'Workspace')
 * @returns {string} Formatted breadcrumb
 */
export const generateBreadcrumb = (pathname, prefix = 'Workspace') => {
  if (pathname === '/') return `${prefix} / Property Portfolio`;
  
  const segments = pathname
    .replace(/^\//, '')
    .split('/')
    .filter(Boolean)
    .map((segment) =>
      segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
    );
  
  return `${prefix} / ${segments.join(' / ')}`;
};
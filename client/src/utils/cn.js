/**
 * Utility function for conditionally joining class names.
 * Filters out falsy values and joins the rest with spaces.
 * 
 * @param {...(string|boolean|undefined|null)} classes - Class names to join
 * @returns {string} - Joined class names
 * 
 * @example
 * cn('btn', isActive && 'btn-active', 'text-sm')
 * // Returns: 'btn btn-active text-sm'
 * 
 * cn(null, 'btn', false, 'text-sm')
 * // Returns: 'btn text-sm'
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export default cn;
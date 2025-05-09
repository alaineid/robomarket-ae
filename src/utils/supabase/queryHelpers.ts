/**
 * Utility functions for working with Supabase and PostgREST queries
 */

/**
 * Formats an array of values for use with Supabase's 'in' filter operator
 * PostgREST expects values in the format: (value1,value2,value3)
 * 
 * @param values - Array of values to format for 'in' filter
 * @returns Properly formatted string for PostgREST 'in' operator
 * 
 * @example
 * // Returns "(value1,value2,value3)"
 * formatInFilter(['value1', 'value2', 'value3'])
 */
export function formatInFilter(values: string[]): string {
  if (!values || !Array.isArray(values) || values.length === 0) {
    throw new Error('formatInFilter requires a non-empty array of values');
  }
  
  return `(${values.join(',')})`;
}

/**
 * Type representing a Supabase query that can be filtered
 * This helps avoid 'any' types while accommodating different query types
 */
export type SupabaseFilterableQuery = {
  filter: (column: string, operator: string, value: string) => SupabaseFilterableQuery;
};

/**
 * Applies a filter condition to a Supabase query based on the provided values
 * If multiple values are provided, it uses an 'in' filter
 * If a single value is provided, it uses an 'eq' filter
 * 
 * @param query - Supabase query to apply the filter to
 * @param field - Database field name to filter on
 * @param values - Value or array of values to filter by
 * @returns The filtered Supabase query
 * 
 * @example
 * // If categories = ['Companion', 'Utility']
 * // Applies: query.filter('category', 'in', '(Companion,Utility)')
 * applyFilter(query, 'category', categories)
 * 
 * // If category = 'Companion'
 * // Applies: query.filter('category', 'eq', 'Companion')
 * applyFilter(query, 'category', category)
 */
export function applyFilter<T extends SupabaseFilterableQuery>(query: T, field: string, values: string | string[]): T {
  // If values is a string, convert it to an array
  const valueArray = typeof values === 'string' ? [values] : values;
  
  if (!valueArray || valueArray.length === 0) {
    return query; // Return unchanged query if no values
  }
  
  if (valueArray.length === 1) {
    // Use equality filter for single value
    return query.filter(field, 'eq', valueArray[0]) as T;
  } else {
    // Use 'in' filter with proper formatting for multiple values
    return query.filter(field, 'in', formatInFilter(valueArray)) as T;
  }
}

/**
 * Split a comma-separated string into an array and apply a filter
 * 
 * @param query - Supabase query to apply the filter to
 * @param field - Database field name to filter on
 * @param value - Comma-separated string or single value
 * @returns The filtered Supabase query
 * 
 * @example
 * // If categoryStr = "Companion,Utility"
 * // Applies: query.filter('category', 'in', '(Companion,Utility)')
 * applyCommaSeparatedFilter(query, 'category', categoryStr)
 */
export function applyCommaSeparatedFilter<T extends SupabaseFilterableQuery>(query: T, field: string, value: string | null): T {
  if (!value) return query;
  
  const values = value.split(',');
  return applyFilter(query, field, values);
}
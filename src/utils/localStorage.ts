/**
 * Generic localStorage utility functions
 * 
 * Provides type-safe methods for reading from and writing to localStorage
 * with automatic JSON serialization/deserialization.
 */

/**
 * Retrieves a value from localStorage and parses it as JSON.
 * Returns the default value if the key doesn't exist or parsing fails.
 * 
 * @param key - The localStorage key to retrieve
 * @param defaultValue - The value to return if key doesn't exist or parsing fails
 * @returns The parsed value or default value
 */
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    
    if (item === null) {
      return defaultValue;
    }
    
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Stores a value in localStorage after serializing it to JSON.
 * 
 * @param key - The localStorage key to set
 * @param value - The value to store (will be JSON stringified)
 */
export function setInLocalStorage<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
}

/**
 * Removes a value from localStorage.
 * 
 * @param key - The localStorage key to remove
 */
export function removeFromLocalStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
  }
}


/**
 * API abstraction layer for Employee Profile
 * 
 * Currently uses localStorage with mock data.
 * Designed to be easily swapped with Convex backend later.
 */

import { Employee, ProfileLayout } from './types';
import { MOCK_EMPLOYEES, MOCK_LAYOUTS } from './mockData';
import { getFromLocalStorage, setInLocalStorage } from '@/utils/localStorage';

const EMPLOYEES_STORAGE_KEY = 'employee-profile-employees';
const LAYOUTS_STORAGE_KEY = 'employee-profile-layouts';

/**
 * Get employee by ID
 */
export async function getEmployeeById(id: string): Promise<Employee | undefined> {
  const useConvex = import.meta.env.VITE_USE_CONVEX === 'true';
  
  if (useConvex) {
    // TODO: Implement Convex API call
    // return await convexClient.query('employees:getById', { id });
    throw new Error('Convex integration not yet implemented');
  }
  
  // Use mock data from localStorage or fallback to static mock
  const stored = getFromLocalStorage<Employee[]>(EMPLOYEES_STORAGE_KEY, []);
  const employees = stored.length > 0 ? stored : MOCK_EMPLOYEES;
  
  return employees.find(emp => emp.id === id);
}

/**
 * Get all employees
 */
export async function getAllEmployees(): Promise<Employee[]> {
  const useConvex = import.meta.env.VITE_USE_CONVEX === 'true';
  
  if (useConvex) {
    // TODO: Implement Convex API call
    // return await convexClient.query('employees:list', {});
    throw new Error('Convex integration not yet implemented');
  }
  
  const stored = getFromLocalStorage<Employee[]>(EMPLOYEES_STORAGE_KEY, []);
  return stored.length > 0 ? stored : MOCK_EMPLOYEES;
}

/**
 * Get all layouts
 */
export async function getLayouts(): Promise<ProfileLayout[]> {
  const useConvex = import.meta.env.VITE_USE_CONVEX === 'true';
  
  if (useConvex) {
    // TODO: Implement Convex API call
    // return await convexClient.query('layouts:list', {});
    throw new Error('Convex integration not yet implemented');
  }
  
  // Use localStorage or fallback to static mock
  const stored = getFromLocalStorage<ProfileLayout[]>(LAYOUTS_STORAGE_KEY, []);
  
  if (stored.length > 0) {
    return stored;
  }
  
  // Initialize with mock layouts
  setInLocalStorage(LAYOUTS_STORAGE_KEY, MOCK_LAYOUTS);
  return MOCK_LAYOUTS;
}

/**
 * Get layout by ID
 */
export async function getLayoutById(id: string): Promise<ProfileLayout | undefined> {
  const layouts = await getLayouts();
  return layouts.find(layout => layout.id === id);
}

/**
 * Save layout
 */
export async function saveLayout(layout: ProfileLayout): Promise<void> {
  const useConvex = import.meta.env.VITE_USE_CONVEX === 'true';
  
  if (useConvex) {
    // TODO: Implement Convex API call
    // return await convexClient.mutation('layouts:save', { layout });
    throw new Error('Convex integration not yet implemented');
  }
  
  // Update localStorage
  const layouts = await getLayouts();
  const index = layouts.findIndex(l => l.id === layout.id);
  
  if (index >= 0) {
    layouts[index] = layout;
  } else {
    layouts.push(layout);
  }
  
  setInLocalStorage(LAYOUTS_STORAGE_KEY, layouts);
}


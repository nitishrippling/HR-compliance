/**
 * Composition Renderer
 * 
 * Renders composition components by looking them up in the registry
 * and mapping employee data to component props based on field mappings.
 */

import React from 'react';
import styled from '@emotion/styled';
import { CompositionInstance } from '../types';
import { Employee } from '../types';
import { getCompositionComponent } from './mock-compositions';
import { StyledTheme } from '@/utils/theme';

interface CompositionRendererProps {
  instance: CompositionInstance;
  employee: Employee;
}

const ErrorContainer = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  background-color: ${({ theme }) => (theme as StyledTheme).colorErrorContainer};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorError};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  color: ${({ theme }) => (theme as StyledTheme).colorOnErrorContainer};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
`;

/**
 * Maps employee data to composition props based on field mappings
 */
function mapEmployeeDataToProps(
  employee: Employee,
  mappings: CompositionInstance['fieldMappings']
): Record<string, any> {
  const props: Record<string, any> = {};

  mappings.forEach(mapping => {
    const employeeValue = (employee as any)[mapping.employeeField];
    if (employeeValue !== undefined) {
      props[mapping.paramName] = employeeValue;
    }
  });

  return props;
}

/**
 * Renders a composition instance with mapped employee data
 */
export const CompositionRenderer: React.FC<CompositionRendererProps> = ({
  instance,
  employee,
}) => {
  const Component = getCompositionComponent(instance.compositionSystemName);

  if (!Component) {
    return (
      <ErrorContainer>
        Composition component not found: {instance.compositionSystemName}
      </ErrorContainer>
    );
  }

  // Map employee data to composition props
  const props = mapEmployeeDataToProps(employee, instance.fieldMappings);

  // Render the component with mapped props
  return <Component {...props} />;
};


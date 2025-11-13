/**
 * Section Content View Component
 *
 * Read-only view of section content including static fields and composition instances.
 * Respects the layout configuration including staticSectionIndex.
 */

import React from 'react';
import styled from '@emotion/styled';
import { t } from '@/utils/theme';
import { LayoutSection, Employee } from '../types';
import { CompositionRenderer } from './CompositionRenderer';

interface SectionContentViewProps {
  section: LayoutSection;
  employee: Employee;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => t(theme).space600};
`;

const CompositionBlock = styled.div`
  /* Compositions are rendered by CompositionRenderer with their own styling */
`;

const StaticFieldsSection = styled.div`
  background-color: ${({ theme }) => t(theme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => t(theme).colorOutlineVariant};
  border-radius: ${({ theme }) => t(theme).shapeCorner2xl};
  padding: ${({ theme }) => t(theme).space600};
`;

const StaticFieldsSectionTitle = styled.h3`
  ${({ theme }) => t(theme).typestyleV2TitleMedium};
  color: ${({ theme }) => t(theme).colorOnSurface};
  margin: 0 0 ${({ theme }) => t(theme).space400} 0;
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => t(theme).space600};
`;

const FieldItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => t(theme).space200};
`;

const FieldLabel = styled.label`
  ${({ theme }) => t(theme).typestyleV2LabelMedium};
  color: ${({ theme }) => t(theme).colorOnSurfaceVariant};
`;

const FieldValue = styled.div`
  ${({ theme }) => t(theme).typestyleV2BodyMedium};
  color: ${({ theme }) => t(theme).colorOnSurface};
`;

/**
 * Default static fields for specific sections
 */
const SECTION_STATIC_FIELDS: Record<string, Array<{
  field: keyof Employee;
  label: string;
  render?: (value: any) => React.ReactNode;
}>> = {
  'role-information': [
    {
      field: 'linkedinProfile',
      label: 'LinkedIn Profile',
      render: (value) => value ? (
        <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
      ) : '-'
    },
    { field: 'legalEntity', label: 'Legal entity' },
    { field: 'title', label: 'Title' },
    { field: 'department', label: 'Department' },
    { field: 'level', label: 'Level' },
    {
      field: 'teams',
      label: 'Teams',
      render: (value) => value && value.length > 0 ? value.join(', ') : '-'
    },
    { field: 'jobFamily', label: 'Job Family' },
    { field: 'duties', label: 'Duties' },
    { field: 'manager', label: 'Manager' },
    { field: 'location', label: 'Work location' },
    { field: 'startDate', label: 'Start date' },
  ],
};

type UnifiedItem =
  | { type: 'static-section'; id: 'static-section' }
  | { type: 'composition'; id: string; instanceId: string };

export const SectionContentView: React.FC<SectionContentViewProps> = ({
  section,
  employee,
}) => {
  const hasStaticFields = !!SECTION_STATIC_FIELDS[section.id];

  // Create unified list: compositions + static section (if exists)
  const createUnifiedList = React.useCallback((): UnifiedItem[] => {
    const items: UnifiedItem[] = [];

    // Add all composition instances
    section.compositionInstances.forEach(instance => {
      items.push({
        type: 'composition',
        id: instance.id,
        instanceId: instance.id
      });
    });

    // Insert static section at the specified index
    if (hasStaticFields) {
      const staticIndex = section.staticSectionIndex ?? 0;
      items.splice(staticIndex, 0, { type: 'static-section', id: 'static-section' });
    }

    return items;
  }, [section.compositionInstances, section.staticSectionIndex, hasStaticFields]);

  const items = createUnifiedList();

  // Render static fields section
  const renderStaticSection = () => {
    if (!hasStaticFields) return null;

    const fields = SECTION_STATIC_FIELDS[section.id];

    return (
      <StaticFieldsSection>
        <StaticFieldsSectionTitle>{section.label}</StaticFieldsSectionTitle>
        <FieldGrid>
          {fields.map(({ field, label, render }) => {
            const value = employee[field];
            const displayValue = render ? render(value) : (value || '-');

            return (
              <FieldItem key={field}>
                <FieldLabel>{label}</FieldLabel>
                <FieldValue>{displayValue}</FieldValue>
              </FieldItem>
            );
          })}
        </FieldGrid>
      </StaticFieldsSection>
    );
  };

  // Render composition instance
  const renderComposition = (instanceId: string) => {
    const instance = section.compositionInstances.find(inst => inst.id === instanceId);
    if (!instance) return null;

    return (
      <CompositionBlock key={instanceId}>
        <CompositionRenderer instance={instance} employee={employee} />
      </CompositionBlock>
    );
  };

  return (
    <Container>
      {items.map(item => {
        if (item.type === 'static-section') {
          return <React.Fragment key={item.id}>{renderStaticSection()}</React.Fragment>;
        } else {
          return <React.Fragment key={item.id}>{renderComposition(item.instanceId)}</React.Fragment>;
        }
      })}
    </Container>
  );
};

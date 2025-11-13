/**
 * Composition Configuration Drawer
 *
 * Right-side drawer for configuring field mappings between composition
 * input parameters and employee data fields.
 */

import React, { useState, useEffect } from 'react';
import Drawer from '@rippling/pebble/Drawer';
import Button from '@rippling/pebble/Button';
import Select from '@rippling/pebble/Inputs/Select';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import { CompositionInstance, FieldMapping, CompositionInputParam } from '../types';
import { Composition } from '../../CompositionManager/types';

interface CompositionConfigDrawerProps {
  isVisible: boolean;
  onCancel: () => void;
  onSave: (mappings: FieldMapping[]) => void;
  instance: CompositionInstance | null;
  composition: Composition | null;
}

const DrawerBody = styled.div`
  /* padding: ${({ theme }) => (theme as StyledTheme).space600}; */
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  /* gap: ${({ theme }) => (theme as StyledTheme).space400}; */
`;

const SectionDescription = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
`;

const MappingRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${({ theme }) => (theme as StyledTheme).space400};
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const MappingLabel = styled.label`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const MappingValue = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

/**
 * Available employee fields for mapping
 */
const EMPLOYEE_FIELDS = [
  { label: 'Employee ID', value: 'id' },
  { label: 'Name', value: 'name' },
  { label: 'Title', value: 'title' },
  { label: 'Department', value: 'department' },
  { label: 'Manager', value: 'manager' },
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
  { label: 'Start Date', value: 'startDate' },
  { label: 'Location', value: 'location' },
  { label: 'Address', value: 'address' },
  { label: 'State', value: 'state' },
  { label: 'LinkedIn Profile', value: 'linkedinProfile' },
  { label: 'Legal Entity', value: 'legalEntity' },
  { label: 'Level', value: 'level' },
  { label: 'Teams', value: 'teams' },
  { label: 'Job Family', value: 'jobFamily' },
  { label: 'Duties', value: 'duties' },
];

/**
 * Get composition input parameters based on system name
 * In a real system, this would come from the composition definition
 */
function getCompositionInputParams(systemName: string): CompositionInputParam[] {
  const paramsMap: Record<string, CompositionInputParam[]> = {
    payroll_summary_card_v3: [
      { name: 'employeeId', type: 'string', label: 'Employee ID', required: true },
      { name: 'employeeName', type: 'string', label: 'Employee Name', required: false },
      { name: 'period', type: 'string', label: 'Period', required: false },
      { name: 'grossPay', type: 'number', label: 'Gross Pay', required: false },
      { name: 'netPay', type: 'number', label: 'Net Pay', required: false },
      { name: 'deductions', type: 'number', label: 'Deductions', required: false },
      { name: 'payDate', type: 'date', label: 'Pay Date', required: false },
    ],
    time_off_request_widget: [
      { name: 'employeeId', type: 'string', label: 'Employee ID', required: true },
      { name: 'employeeName', type: 'string', label: 'Employee Name', required: false },
      { name: 'availableBalance', type: 'number', label: 'Available Balance', required: false },
      { name: 'usedBalance', type: 'number', label: 'Used Balance', required: false },
      { name: 'totalBalance', type: 'number', label: 'Total Balance', required: false },
      { name: 'unit', type: 'string', label: 'Unit', required: false },
    ],
  };

  return paramsMap[systemName] || [];
}

export const CompositionConfigDrawer: React.FC<CompositionConfigDrawerProps> = ({
  isVisible,
  onCancel,
  onSave,
  instance,
  composition,
}) => {
  const { theme } = usePebbleTheme();
  const [mappings, setMappings] = useState<FieldMapping[]>([]);

  useEffect(() => {
    if (instance && composition) {
      // Initialize mappings from instance or create defaults
      if (instance.fieldMappings.length > 0) {
        setMappings(instance.fieldMappings);
      } else {
        // Create default mappings based on composition input params
        const params = getCompositionInputParams(composition.systemName);
        const defaultMappings: FieldMapping[] = params.map(param => ({
          paramName: param.name,
          employeeField: '', // No default mapping
        }));
        setMappings(defaultMappings);
      }
    }
  }, [instance, composition]);

  const handleMappingChange = (paramName: string, employeeField: string) => {
    setMappings(prev =>
      prev.map(mapping =>
        mapping.paramName === paramName ? { ...mapping, employeeField } : mapping,
      ),
    );
  };

  const handleSave = () => {
    // Filter out empty mappings
    const validMappings = mappings.filter(m => m.employeeField);
    onSave(validMappings);
  };

  if (!instance || !composition) {
    return null;
  }

  const inputParams = getCompositionInputParams(composition.systemName);

  return (
    <Drawer
      isVisible={isVisible}
      onCancel={onCancel}
      title={`Configure ${composition.name}`}
      width={600}
    >
      <DrawerBody>
        <Section>
          <SectionDescription>
            Map composition input parameters to employee data fields. The composition will receive
            employee data based on these mappings.
          </SectionDescription>

          {inputParams.map(param => {
            const currentMapping = mappings.find(m => m.paramName === param.name);
            const currentValue = currentMapping?.employeeField || '';

            return (
              <MappingRow key={param.name}>
                <MappingLabel>
                  {param.label}
                  {param.required && <span style={{ color: theme.colorError }}> *</span>}
                </MappingLabel>
                <MappingValue>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <Select
                      id={`mapping-${param.name}`}
                      placeholder="Select employee field"
                      list={EMPLOYEE_FIELDS}
                      value={currentValue}
                      onChange={value => handleMappingChange(param.name, value as string)}
                      isSearchable
                    />
                  </span>
                </MappingValue>
              </MappingRow>
            );
          })}
        </Section>
      </DrawerBody>

      <Drawer.Footer>
        <Button appearance={Button.APPEARANCES.OUTLINE} onClick={onCancel} size={Button.SIZES.M}>
          Cancel
        </Button>
        <Button appearance={Button.APPEARANCES.PRIMARY} onClick={handleSave} size={Button.SIZES.M}>
          Save
        </Button>
      </Drawer.Footer>
    </Drawer>
  );
};

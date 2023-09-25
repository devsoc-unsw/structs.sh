import React, { useState } from 'react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Root, Trigger, Content, Item } from '@radix-ui/react-dropdown-menu';
import { BackendTypeDeclaration, NativeTypeName, PointerType } from '../../Types/backendType';
import { useGlobalStore } from '../../Store/globalStateStore';
import { MotionCollapse } from './MotionCollapse';

export enum FieldType {
  RECURSIVE,
  BASE,
}

export interface PossibleFieldBase {
  type: FieldType;
}

export interface PossibleRecursiveField extends PossibleFieldBase {
  name: string;
  typeName: PointerType['typeName'];
  type: FieldType.RECURSIVE;
}

export interface PossiblePropertyField extends PossibleFieldBase {
  name: string;
  typeName: NativeTypeName;
  type: FieldType.BASE;
}

export type PossibleField = PossibleRecursiveField | PossiblePropertyField;

export type PossibleStructAnnotation = {
  typeName: string;
  possibleFields: {
    name: string;
    possibleChoices: PossibleField[];
  };
};

export type TypeAnnotationProp = {
  typeDeclaration: BackendTypeDeclaration;
};

export enum BackendTypeRole {
  LinkedList = 'Linked List Node',
  Empty = 'Not Visualized',
}

export const TypeAnnotation: React.FC<TypeAnnotationProp> = ({
  typeDeclaration,
}: TypeAnnotationProp) => {
  const { typeName } = typeDeclaration;
  const { typeAnnotation } = useGlobalStore().visualizer.userAnnotation;

  const [selectedRole, setSelectedRole] = useState<BackendTypeRole>(BackendTypeRole.Empty);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div style={{ paddingBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>{typeName}</div>

        <div>
          <button
            type="button"
            style={{ color: selectedRole === BackendTypeRole.Empty ? 'grey' : 'black' }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedRole}
            <ChevronDownIcon
              fontWeight="bold"
              style={{
                transform: `rotate(${isDropdownOpen ? 180 : 0}deg)`, // This part may need to be adjusted with Radix's state
                transition: 'transform 0.3s',
                marginRight: '10px',
                scale: '1.35',
              }}
            />
          </button>

          <MotionCollapse isOpen={isDropdownOpen}>
            {isDropdownOpen ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {Object.entries(BackendTypeRole).map((role) => (
                  <button
                    key={role[0]}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role[1] as BackendTypeRole);
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      background: '#f7f7f7',
                      border: '1px solid #e0e0e0',
                      borderRadius: '5px',
                      paddingTop: '3px',
                      paddingBottom: '3px',
                      marginRight: '5px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#e0e0e0';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f7f7f7';
                    }}
                  >
                    {role[1]}
                  </button>
                ))}
              </div>
            ) : null}
          </MotionCollapse>
        </div>
      </div>
    </div>
  );
};

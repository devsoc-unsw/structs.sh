// @ts-nocheck
import React, { useEffect, useState } from 'react';
import styles from 'styles/Configuration.module.css';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { MotionCollapse } from './MotionCollapse';
import './typeAnnotation.css';
import { StackVariableRole } from '../../Types/annotationType';
import { MemoryValue, isPointerType } from '../../Types/backendType';
import { useGlobalStore } from '../../Store/globalStateStore';

export type StackVariableAnnotationProp = {
  name: string;
  memoryValue: MemoryValue;
};

export const StackVarAnnotation: React.FC<StackVariableAnnotationProp> = ({
  name,
  memoryValue,
}: StackVariableAnnotationProp) => {
  // Annotate by default if the variable contains a pointer
  const [selectedRole, setSelectedRole] = useState<StackVariableRole>(
    isPointerType(memoryValue.typeName)
      ? StackVariableRole.LinkedListPointer
      : StackVariableRole.Empty
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const stackAnnotation = useGlobalStore(
    (state) => state.visualizer.userAnnotation.stackAnnotation
  );
  const updateStackAnnotation = useGlobalStore((state) => state.updateStackAnnotation);

  // Annotate by default if the variable contains a pointer
  useEffect(() => {
    if (selectedRole === StackVariableRole.LinkedListPointer || selectedRole === StackVariableRole.BinaryTreePointer) {
      const newStackAnnotation = {
        [name]: memoryValue.typeName,
      };
      updateStackAnnotation(newStackAnnotation);
    }

    // Persist the stack variable state
    if (name in stackAnnotation && stackAnnotation[name] === null) {
      setSelectedRole(StackVariableRole.Empty);
    }
  }, []);

  return (
    <div style={{ paddingBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
          <span>
            <SyntaxHighlighter language="c" style={github} className="syntax-highlighter-custom">
              {`${memoryValue.typeName} ${name}`}
            </SyntaxHighlighter>
          </span>
        </div>

        <div style={{ fontSize: '0.8rem' }}>
          <button
            type="button"
            style={{ color: selectedRole === StackVariableRole.Empty ? 'grey' : 'black' }}
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
                {Object.entries(StackVariableRole).map((role) => (
                  <button
                    key={role[0]}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role[1]);
                      if (role[1] === StackVariableRole.LinkedListPointer || role[1] === StackVariableRole.BinaryTreePointer) {
                        updateStackAnnotation({ [name]: memoryValue.typeName });
                      } else {
                        updateStackAnnotation({ [name]: null });
                      }
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      background: '#f7f7f7',
                      border: '1px solid #e0e0e0',
                      paddingTop: '3px',
                      paddingBottom: '3px',
                      paddingRight: '5px',
                      paddingLeft: '5px',
                      marginLeft: '-5px',
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

      <MotionCollapse isOpen={selectedRole === StackVariableRole.LinkedListPointer}>
        {!isPointerType(memoryValue.typeName) ? (
          <div className={styles.configuratorField}>
            <span>
              <span className={styles.highlightError}>Error:</span> Local Variable is not a pointer{' '}
              <span className={styles.highlightLinkedList}>linked list</span> annotation can be
              made.
            </span>
          </div>
        ) : null}
      </MotionCollapse>
    </div>
  );
};

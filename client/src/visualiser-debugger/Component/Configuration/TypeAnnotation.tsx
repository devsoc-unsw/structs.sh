import React, { useEffect, useState } from 'react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { github, dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { MotionCollapse } from './MotionCollapse';
import './typeAnnotation.css';
import { BackendTypeRole } from '../../Types/annotationType';
import {
  LinkedListNodeAnnotation,
  createPossibleLinkedListTypeDecl,
} from './RoleAnnotation/LinkedListAnnotation';
import { BackendTypeDeclaration } from '../../Types/backendType';
import { useTheme } from '../../Contexts/ThemeContexts';

export type TypeAnnotationProp = {
  typeDeclaration: BackendTypeDeclaration;
};

export const TypeAnnotation: React.FC<TypeAnnotationProp> = ({
  typeDeclaration,
}: TypeAnnotationProp) => {
  const { typeName } = typeDeclaration;
  const [selectedRole, setSelectedRole] = useState<BackendTypeRole>(BackendTypeRole.Empty);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { darkMode } = useTheme();

  useEffect(() => {
    if (createPossibleLinkedListTypeDecl(typeDeclaration) !== null) {
      setSelectedRole(BackendTypeRole.LinkedList);
    }
  }, []);

  return (
    <div style={{ paddingBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
          <span>
            <SyntaxHighlighter language="c" style={darkMode ? dark : github} className="syntax-highlighter-custom">
              {typeName}
            </SyntaxHighlighter>
          </span>
        </div>

        <div style={{ fontSize: '0.8rem' }}>
          <button
            type="button"
            style={{ color: selectedRole === BackendTypeRole.Empty ? 'var(--text-secondary)' : 'var(--text-primary)' }}
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
                      setSelectedRole(role[1]);
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
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
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--bg-primary)';
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

      <MotionCollapse isOpen={selectedRole === BackendTypeRole.LinkedList}>
        <LinkedListNodeAnnotation backendType={typeDeclaration} />
      </MotionCollapse>
    </div>
  );
};

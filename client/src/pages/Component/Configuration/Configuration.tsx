import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import styles from 'styles/Configuration.module.css';
import { useGlobalStore } from '../../Store/globalStateStore';
import { MotionCollapse } from './MotionCollapse';
import { TypeAnnotation } from './TypeAnnotation';
import { StackVarAnnotation } from './StackVarDeclaration';

const Configuration = () => {
  const [isTypeAnnotationOpen, setIsAnnotationOpen] = useState(true);

  const [isVariableAnnotationOpen, setIsVariableAnnotationOpen] = useState(true);
  const { typeDeclarations } = useGlobalStore().visualizer;
  const { currFrame } = useGlobalStore();
  const { visualizer } = useGlobalStore();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '500px',
        // overflowY: 'auto',
        gap: '0.8rem',
      }}
    >
      {/* For Type Annotations */}
      <div>
        <button
          onClick={() => setIsAnnotationOpen(!isTypeAnnotationOpen)}
          type="button"
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              setIsAnnotationOpen(!isTypeAnnotationOpen);
            }
          }}
        >
          <ChevronDownIcon
            fontWeight="bold"
            style={{
              transform: `rotate(${isTypeAnnotationOpen ? 180 : 0}deg)`,
              transition: 'transform 0.3s',
              marginRight: '10px',
              scale: '1.35',
            }}
          />
          Types
        </button>

        <MotionCollapse isOpen={isTypeAnnotationOpen}>
          {isTypeAnnotationOpen ? (
            <div className={styles.indentedAnnotationArea}>
              {typeDeclarations.map((declaration, index) => (
                <TypeAnnotation typeDeclaration={declaration} key={index} />
              ))}
            </div>
          ) : null}
        </MotionCollapse>
      </div>

      {/* For Variable Annotations */}
      <div>
        <button
          onClick={() => setIsVariableAnnotationOpen(!isVariableAnnotationOpen)}
          type="button"
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              setIsVariableAnnotationOpen(!isVariableAnnotationOpen);
            }
          }}
        >
          <ChevronDownIcon
            fontWeight="bold"
            style={{
              transform: `rotate(${isVariableAnnotationOpen ? 180 : 0}deg)`,
              transition: 'transform 0.3s',
              marginRight: '10px',
              scale: '1.35',
            }}
          />
          Locals
        </button>

        <MotionCollapse isOpen={isVariableAnnotationOpen}>
          {isVariableAnnotationOpen ? (
            <div className={styles.indentedAnnotationArea}>
              {Object.entries(currFrame.stack_data).map(([name, memoryValue]) => (
                <StackVarAnnotation key={name} name={name} memoryValue={memoryValue} />
              ))}
            </div>
          ) : null}
        </MotionCollapse>
      </div>
    </div>
  );
};

export default Configuration;

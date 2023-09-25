import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useGlobalStore } from '../../Store/globalStateStore';
import { MotionCollapse } from './MotionCollapse';
import { TypeAnnotation } from './TypeDeclaration';
import { StackVarAnnotation } from './StackVarDeclaration';

const Configuration = () => {
  const [isTypeAnnotationOpen, setIsAnnotationOpen] = useState(false);

  const [isVariableAnnotationOpen, setIsVariableAnnotationOpen] = useState(false);
  const { typeDeclarations } = useGlobalStore().visualizer;
  const { currFrame } = useGlobalStore();
  const { visualizer } = useGlobalStore();
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', maxHeight: '500px', overflowY: 'auto' }}
    >
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
            <>
              {typeDeclarations.map((declaration, index) => (
                <TypeAnnotation typeDeclaration={declaration} key={index} />
              ))}
            </>
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
            <>
              {Object.entries(currFrame.stack_data).map(([name, memoryValue]) => (
                <StackVarAnnotation key={name} name={name} memoryValue={memoryValue} />
              ))}
            </>
          ) : null}
        </MotionCollapse>
      </div>

      <button
        type="button"
        onClick={() =>
          console.log(
            typeDeclarations,
            visualizer.userAnnotation,
            visualizer.userAnnotation.stackAnnotation
          )
        }
      >
        debug
      </button>
    </div>
  );
};

export default Configuration;

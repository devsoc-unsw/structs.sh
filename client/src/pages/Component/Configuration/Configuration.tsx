import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useGlobalStore } from '../../Store/globalStateStore';
import { MotionCollapse } from './MotionCollapse';
import { TypeAnnotation } from './TypeDeclaration';

const Configuration = () => {
  const [isTypeAnnotationOpen, setIsAnnotationOpen] = useState(false);

  const [isVariableAnnotationOpen, setIsVariableAnnotationOpen] = useState(false);
  const mockVariableDeclarations = ['Variable1', 'Variable2', 'Variable3'];

  const { typeDeclarations } = useGlobalStore().visualizer;
  const { visualizer } = useGlobalStore();
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
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
              {mockVariableDeclarations.map((variable, index) => (
                <div key={index}>{variable}</div> // Replace with your component or rendering logic
              ))}
            </>
          ) : null}
        </MotionCollapse>
      </div>

      <button
        type="button"
        onClick={() => console.log(typeDeclarations, visualizer.userAnnotation.typeAnnotation)}
      >
        debug
      </button>
    </div>
  );
};

export default Configuration;

import { useState, useEffect } from "react";
import { Annotation, Annotations, BackendState } from "./visualizer-component/types/backendType";

export interface AnnotationProps {
  backendState: BackendState;
  setAnnotations: (annotations: Annotations) => void;
}

const AnnotationComponent: React.FC<AnnotationProps> = ({ backendState, setAnnotations }) => {
  const [localAnnotations, setLocalAnnotations] = useState<Annotation[]>([]);

  useEffect(() => {
    const initialAnnotations = Object.keys(backendState.type).map(cStructName => ({
      cStructName,
      type: null,
      mapping: {},
    }));
    setLocalAnnotations(initialAnnotations);
  }, [backendState.type]);

  const handleAnnotationChange = (index: number, field: string, value: any) => {
    const newAnnotations = [...localAnnotations];
    newAnnotations[index][field] = value;
    setLocalAnnotations(newAnnotations);

    let annotations: Annotations = {};
    newAnnotations.forEach((annotation) => {
      if (annotation.type) {
        annotations[annotation.cStructName] = annotation;
      }
    });
    setAnnotations(annotations);
  };

  return (
    <div>
      <h2>Annotations</h2>
      {localAnnotations.map((annotation, index) => (
        <div key={index}>
          <label>
            C Struct Name:
            <select
              value={annotation.cStructName}
              onChange={(e) => handleAnnotationChange(index, 'cStructName', e.target.value)}
            >
              {Object.keys(backendState.type).map(cStructName => (
                <option key={cStructName} value={cStructName}>{cStructName}</option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Type:
            <select
              value={annotation.type}
              onChange={(e) => handleAnnotationChange(index, 'type', e.target.value)}
            >
              <option value="next-pointer">Next Pointer</option>
              <option value="display-above">Display Above</option>
              <option value="display-below">Display Below</option>
              <option value="display-center">Display Center</option>
            </select>
          </label>
          <br />
          {Object.keys(backendState.type[annotation.cStructName].fields).map((propertyName) => (
            <div key={propertyName}>
              <label>
                {propertyName}:
                <select
                  value={annotation.mapping[propertyName]}
                  onChange={(e) => handleAnnotationChange(index, 'mapping', {...annotation.mapping, [propertyName]: e.target.value})}
                >
                  <option value="next-pointer">Next Pointer</option>
                  <option value="display-above">Display Above</option>
                  <option value="display-below">Display Below</option>
                  <option value="display-center">Display Center</option>
                </select>
              </label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AnnotationComponent;

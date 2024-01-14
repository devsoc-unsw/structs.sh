import React from 'react';
import { BackendTypeDeclaration } from '../../../Types/backendType';

export interface AnnotationProp {
  backendType: BackendTypeDeclaration;
}

export type AnnotationComponent = React.FC<AnnotationProp>;

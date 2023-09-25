import { NativeTypeName, PointerType } from '../../Types/backendType';

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

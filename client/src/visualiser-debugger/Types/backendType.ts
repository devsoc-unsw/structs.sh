/**
 * Backend data structure definition
 */

// TODO: should an explicit 'null' be includded in addresses? Or should it map to 0x00
export type Addr = `0x${string}`;
export type Name = string;

export type IntType = {
  typeName: 'int';
};
export type IntValue = {
  type: IntType;
  value: number;
};

export type FloatType = {
  typeName: 'float';
};
export type FloatValue = {
  type: FloatType;
  value: number;
};

export type DoubleType = {
  typeName: 'double';
};
export type DoubleValue = {
  type: DoubleType;
  value: number;
};

export type CharType = {
  typeName: 'char';
};
export type CharValue = {
  type: CharType;
  value: string;
};

export type StructType = {
  typeName: `struct ${string}`;
  fields: Record<Name, NativeType>;
};
export type StructValue = {
  type: StructType;
  value: Record<Name, TypedValue>;
};

export type PointerType = {
  typeName: `${string}*`;
  innerType: NativeType;
};
export type PointerValue = {
  type: PointerType;
  value: Addr;
};

export type ArrayType = {
  typeName: `${string}[]`;
  innerType: NativeType;
};

export type SizetType = {
  typeName: 'size_t';
};

export type SizetValue = {
  type: SizetType;
  value: null;
};
export type ArrayValue = {
  type: ArrayType;
  // It is important that the value of an ArrayValue is an array of TypedValue,
  // not an array of Value. This is to support nested types e.g. array of structs.
  value: TypedValue[];
  size: number; // Capacity of array
  userTypeDeclaration: string;
};

export type TypedValue =
  | IntValue
  | FloatValue
  | DoubleValue
  | CharValue
  | StructValue
  | PointerValue
  | SizetValue
  | ArrayValue;

export type MemoryValue = TypedValue & { addr: Addr };
export type NativeType = TypedValue['type'];
export type Value = TypedValue['value'];
export type NativeTypeName = NativeType['typeName'];

export type Stack = Record<Name, MemoryValue>;
export type Heap = Record<Addr, MemoryValue>;

export type BackendState = {
  frame_info: {
    file: string;
    line: string;
    line_num: number;
    function: string;
  };
  stack_data: Stack;
  heap_data: Heap;
};

export type ProgramEnd = {
  exited: true;
};

export function isProgramEnd(state: BackendState | ProgramEnd): state is ProgramEnd {
  return (state as ProgramEnd).exited !== undefined;
}

export type BackendTypeDeclaration = {
  file: string;
  line_num: string;
  original_line: string;
  typeName: NativeTypeName;
  // For structs, the fields
  fields?: {
    name: Name;
    typeName: NativeTypeName;
  }[];
  // For typedefs, the type being aliased
  type?: {
    typeName: NativeTypeName;
  };
};

export const isStructTypeName = (typeName: string): typeName is StructType['typeName'] => {
  return typeName.startsWith('struct ');
};

export const isPointerType = (typeName: string): typeName is PointerType['typeName'] => {
  return typeName.endsWith('*');
};

export const isArrayType = (typeName: string): typeName is ArrayType['typeName'] => {
  return typeName.endsWith('[]');
};

export const isNativeTypeName = (typeName: string): typeName is NativeTypeName => {
  return (
    typeName === 'int' ||
    typeName === 'float' ||
    typeName === 'double' ||
    typeName === 'char' ||
    isStructTypeName(typeName) ||
    isPointerType(typeName) ||
    isArrayType(typeName)
  );
};

export const INITIAL_BACKEND_STATE: BackendState = {
  frame_info: {
    file: '',
    line: '',
    line_num: 0,
    function: '',
  },
  stack_data: {},
  heap_data: {},
};

export function isInitialBackendState(state: BackendState): boolean {
  return (
    state.frame_info.file === '' &&
    state.frame_info.line === '' &&
    state.frame_info.line_num === 0 &&
    state.frame_info.function === '' &&
    Object.keys(state.stack_data).length === 0 &&
    Object.keys(state.heap_data).length === 0
  );
}

/*
=== Examples ===
Stack will look like Heap, except the keys are variable names instead of addresses.
Heap will look something like this:
{
  "0x78": {
    type: "int",
    value: 5,
    addr: "0x78",
  },
  "0x7C": {
    type: "char",
    value: "a",
    addr: "0x7C",
  },
  "0x80": {
    type: "double*",
    value: "0x4832902",
    addr: "0x80",
  }
  "0x84": {
    type: "struct train",
    value: {
      "carriageWeight": {
        type: "int",
        value: 5,
      },
      "nextCarriage": {
        type: "struct train*",
        value: "0x0",
      },
    },
    addr: "0x84",
  },
  "0x88": {
    type: "float[]",
    value: [
      {
        type: "float",
        value: 5.5,
      },
      {
        type: "float",
        value: 6.5,
      }
    ],
    addr: "0x88",
    size: 2,
  }
  "0x8C": {
    type: "char[]",
    value: [
      {
        type: "char",
        value: 'o',
      },
      {
        type: "char",
        value: 'k',
      },
      {
        type: "char",
        value: '\0',
      }
    ],
    addr: "0x8C",
    size: 3,
  }
  "0x90": {
    type: "struct playlist[]",
    value: [
      {
        type: "struct playlist",
        value: {
          "title": {
            type: "char[]",
            value: "a",
          },
          "tracks": {
            type: "int[]",
            value: [
              { type: "int", value: 1 },
              { type: "int", value: 2 },
              { type: "int", value: 3 },
            ],
            addr: "0x98",
            size: 3,
          },
        },
      },
      {
        type: "struct playlist",
        value: {
          "title": {
            type: "char[]",
            value: "b",
          },
          "tracks": {
            type: "int[]",
            value: [],
            addr: "0xA0",
            size: 0,
          },
        },
      },
    ],
    addr: "0x90",
    size: 2,
  }
}
*/

// ===================================================
/*
export type Addr = number;
export enum CType {
  DOUBLY_LINKED_LIST_NODE = 'struct doubly_list_node',
  LINKED_LIST_NODE = 'struct node',
  LINKED_LIST_HEAD = 'struct list',
  TREE_NODE = 'struct tree_node',
  INT = 'int',
  DOUBLE = 'double',
  CHAR = 'char',
  POINTER = `*`,
  STRUCT = "struct",
}

type INT_TYPE = "int"
type DOUBLE_TYPE = "double"
type CHAR_TYPE = "char"

type CTYPE = INT_TYPE | DOUBLE_TYPE | CHAR_TYPE | `${string}*` | `struct ${string}`

export type DoublePointerVariable = {
  value: string;
  prev: Addr;
  next: Addr;
};

export type TreeVariable = {
  value: string;
  left: Addr;
  right: Addr;
};

export type SinglePointerVariable = {
  data: string;
  next: Addr;
};

export type IntVariable = number;
export type DoubleVariable = number;
export type CharVariable = string;

export type BackendValue =
  | DoublePointerVariable
  | SinglePointerVariable
  | IntVariable
  | DoubleVariable
  | CharVariable
  | TreeVariable;

export interface BackendVariableBase {
  addr: Addr;
  value: Addr | BackendValue;
  type: number;
  is_pointer: boolean;
  // is_array?
  // is_struct?
  // deref?
  name: string;
}

export interface BackendVariablePointer extends BackendVariableBase {
  value: Addr;
  type: `${string}*`;
  is_pointer: true;
}

export interface BackendVariableBaseInt extends BackendVariableBase {
  value: IntVariable;
  type: INT_TYPE;
  is_pointer: false;
}

export interface BackendVariableBaseDouble extends BackendVariableBase {
  value: DoubleVariable;
  type: DOUBLE_TYPE;
  is_pointer: false;
}

export interface BackendVariableBaseChar extends BackendVariableBase {
  value: CharVariable;
  type: "char";
  is_pointer: false;
}

export interface BackendVariableBaseStruct extends BackendVariableBase {
  value: BackendValue;
  type: CType.STRUCT;
  is_pointer: false;
}

export interface BackendVariableBaseDoubleLinkedList extends BackendVariableBase {
  data: DoublePointerVariable;
  type: CType.DOUBLY_LINKED_LIST_NODE;
  is_pointer: false;
}

export interface BackendVariableBaseSingleLinkedList extends BackendVariableBase {
  data: SinglePointerVariable;
  type: CType.LINKED_LIST_NODE | CType.LINKED_LIST_HEAD;
  is_pointer: false;
}

export interface BackendVariableBaseTree extends BackendVariableBase {
  data: TreeVariable;
  type: CType.TREE_NODE;
  is_pointer: false;
}

export type BackendVariableNonPointerConcrete =
  | BackendVariableBaseInt
  | BackendVariableBaseDouble
  | BackendVariableBaseChar
  | BackendVariableBasePointer;
  | BackendVariableBaseStruct;
  | BackendVariableBaseDoubleLinkedList
  | BackendVariableBaseSingleLinkedList
  | BackendVariableBaseTree;

export interface BackendVariableBasePointer extends BackendVariableBase {
  value: Addr;
  type: CType;
  is_pointer: true;
  size: number;
}


export type BackendVariableConcrete = BackendVariablePointer | BackendVariableNonPointerConcrete;



*/

// Functional definition type
// TODO: FIGURE OUT HOW SHOULD WE DISPLAY TO USER?? OR IS IT EVEN USED.
interface FunctionParameter {
  type: string;
  name: string | null; // `name` can be `null` based on your comment
}

interface FunctionDeclaration {
  return_type: string;
  params: FunctionParameter[];
}

export interface FunctionStructure {
  name: string;
  func_decl: FunctionDeclaration;
}

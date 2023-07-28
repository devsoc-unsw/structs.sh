import { BackendStructure, EditorAnnotation, GenericGraph, BackendUpdate } from "../types/graphState";
import { Parser } from "./parser";

class LinkedListParser implements Parser {
  parseInitialState(backendStructure: BackendStructure, editorAnnotation: EditorAnnotation) {
    return undefined;
  };

  updateState(frontendStructure: GenericGraph, backendStructure: BackendStructure, backendUpdate: BackendUpdate, editorAnnotation: EditorAnnotation) {
    return undefined;
  }
}
import { BackendTypeRole } from "visualiser-debugger/Types/annotationType";
import { LinkedListNodeAnnotation } from "./LinkedListAnnotation";
import { assertUnreachable } from "visualiser-debugger/Component/Visualizer/Util/util";
import { TypeAnnotationProp } from "../TypeAnnotation";
import { TreeNodeAnnotation } from "./BinaryTreeAnnotation";
export function AnnotationFactory (backendRole: BackendTypeRole, {
    typeDeclaration,
  }: TypeAnnotationProp) : JSX.Element | null {
    switch(backendRole){
        case BackendTypeRole.LinkedList:
            return <LinkedListNodeAnnotation backendType={typeDeclaration} />
        case BackendTypeRole.BinaryTree:    
            return <TreeNodeAnnotation backendType={typeDeclaration} />
        case BackendTypeRole.Empty:
            return null;
        default:
            assertUnreachable(backendRole);
}
    return null;
}
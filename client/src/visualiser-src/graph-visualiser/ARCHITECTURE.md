# Graph visualiser architecture

The graph visualiser at a glance: which classes exist and how they connect. For the detail, see `Graph_Visualiser_Spec.md`.

```mermaid
classDiagram
    direction LR

    class VisualiserController {
        <<plays animations>>
    }
    class GraphicalDataStructure {
        <<base class>>
    }
    class AnimationProducer {
        <<base class>>
    }
    class GraphicalGraph {
        <<entry point>>
        insert()
        delete()
        addEdge()
        deleteEdge()
    }
    class Graph {
        <<data and rules>>
    }
    class GraphicalGraphNode {
        <<one vertex on screen>>
    }
    class GraphAnimationProducer {
        <<records animations>>
    }
    class PerOperationProducers {
        <<one per operation>>
    }
    class util {
        <<layout maths>>
    }

    GraphicalDataStructure <|-- GraphicalGraph
    AnimationProducer <|-- GraphAnimationProducer
    GraphAnimationProducer <|-- PerOperationProducers

    VisualiserController --> GraphicalGraph : runs an operation
    GraphicalGraph --> Graph : is this legal?
    GraphicalGraph *-- GraphicalGraphNode : owns
    GraphicalGraph --> PerOperationProducers : creates and returns
    GraphicalGraph --> util : where do vertices go?
    PerOperationProducers --> VisualiserController : played by

    style VisualiserController fill:#eceff4,stroke:#5f6b7a
    style GraphicalDataStructure fill:#eceff4,stroke:#5f6b7a
    style AnimationProducer fill:#eceff4,stroke:#5f6b7a
    style Graph fill:#dff5e6,stroke:#2e7d4f
    style GraphicalGraphNode fill:#dff5e6,stroke:#2e7d4f
    style util fill:#dff5e6,stroke:#2e7d4f
    style GraphicalGraph fill:#fff4d6,stroke:#b8860b,stroke-dasharray:4 3
    style GraphAnimationProducer fill:#fff4d6,stroke:#b8860b,stroke-dasharray:4 3
    style PerOperationProducers fill:#fff4d6,stroke:#b8860b,stroke-dasharray:4 3
```

- Grey: shared code in `common/` and `controller/`. You use it but don't change it.
- Green: done.
- Dashed yellow: still to build.
- Triangle arrows mean "is a kind of", the diamond means "owns", and plain arrows mean "uses".

The per-operation producers are `GraphInsertAnimationProducer`, `GraphDeleteAnimationProducer`, `GraphAddEdgeAnimationProducer`, and `GraphDeleteEdgeAnimationProducer`. Each one just loads its C snippet into the code panel.

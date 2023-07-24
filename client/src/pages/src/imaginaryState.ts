import { BackendLinkedList } from "./framer-component/types/graphState";

export const IMAGINARY_STATE_1: BackendLinkedList[] = [
  {
    nodes: [
      {
        nodeId: "0x000001",
        value: "Node 1",
        next: "0x000002",
      },
      {
        nodeId: "0x000002",
        value: "Node 2",
        next: "0x000003",
      },
      {
        nodeId: "0x000003",
        value: "Node 3",
        next: "0x000004",
      },
      {
        nodeId: "0x000004",
        value: "Node 4",
        next: null,
      },
    ],
  },
  {
    nodes: [
      {
        nodeId: "0x000001",
        value: "Node 1",
        next: "0x000002",
      },
      {
        nodeId: "0x000002",
        value: "Node 2",
        next: "0x000003",
      },
      {
        nodeId: "0x000003",
        value: "Node 3",
        next: "0x000004",
      },
      {
        nodeId: "0x000004",
        value: "Node 4",
        next: "0x000005",
      },
      {
        nodeId: "0x000005",
        value: "Node 5",
        next: null,
      },
    ],
  },
  {
    nodes: [
      {
        nodeId: "0x000001",
        value: "Node 1",
        next: "0x000002",
      },
      {
        nodeId: "0x000002",
        value: "Node 2",
        next: null,
      },
      {
        nodeId: "0x000004",
        value: "Node 4",
        next: "0x000005",
      },
      {
        nodeId: "0x000005",
        value: "Node 5",
        next: null,
      },
    ],
  },
  {
    nodes: [
      {
        nodeId: "0x000001",
        value: "Node 1",
        next: "0x000002",
      },
      {
        nodeId: "0x000002",
        value: "Node 2",
        next: "0x000004",
      },
      {
        nodeId: "0x000004",
        value: "Node 4",
        next: "0x000005",
      },
      {
        nodeId: "0x000005",
        value: "Node 5",
        next: null,
      },
    ],
  },
]

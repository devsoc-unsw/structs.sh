import { SimulationLinkDatum, SimulationNodeDatum } from 'd3';

/**
 * Gets the edge's ID string fragment, used with other substrings to uniquely
 * identify an edge.
 *
 * Why do we need to do this? Annoyingly, we have to use the `id` attribute in
 * some places. Since we need to uniquely identify the same edge regardless of
 * the order of src and dest, we'll need to maintain a consistent order.
 * I.e. we want to treat 1-3 and 3-1 as the same when looking up that edge.
 *
 * @param edge
 * @returns v-w, where v and w are vertex numbers.
 */
export const getEdgeIdFragment = (edge: SimulationLinkDatum<SimulationNodeDatum>) => {
  const src =
    typeof edge.source === 'string'
      ? parseInt(edge.source, 10)
      : typeof edge.source === 'number'
      ? edge.source
      : edge.source.index;
  const dest =
    typeof edge.target === 'string'
      ? parseInt(edge.target, 10)
      : typeof edge.target === 'number'
      ? edge.target
      : edge.target.index;
  const startVertex = src < dest ? src : dest;
  const endVertex = src < dest ? dest : src;
  return `${startVertex}-${endVertex}`;
};

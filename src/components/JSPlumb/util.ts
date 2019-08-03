export const PREFIX = {
  CONNECTION: 'conn',
  GRAPH: 'dag',
  NDOE: 'node',
};

export function generateHtmlId(
  prefix: string,
  diagramId: string,
  id: string,
): string {
  return `${prefix}-${diagramId.toString().slice(-5)}-${id.toString().slice(-5)}`;
}

export function generateNodeId(
  diagramId: string,
  id: string,
): string {
  return generateHtmlId(PREFIX.NDOE, diagramId, id);
};

export function generateConnectionId(
  diagramId: string,
  id: string,
): string {
  return generateHtmlId(PREFIX.CONNECTION, diagramId, id);
};

export function generateGraphId(
  id: string,
): string {
  return `${PREFIX.GRAPH}-${id}`
};
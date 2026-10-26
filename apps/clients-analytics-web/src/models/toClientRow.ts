import { childrenOf, type PayloadNode } from '@app/domain/clients';
import type { ClientRow } from './types.ts';

/** The payload as one tree of rows: the same shape on every level, with its depth. */
export const toClientRow = (node: PayloadNode, level = 0): ClientRow => ({
  id: node.id,
  name: node.name,
  level,
  values: [...node.values],
  children: childrenOf(node).map((child) => toClientRow(child, level + 1)),
});

/** The row with this id in the tree, or `undefined`. */
export const findRow = (row: ClientRow, id: string): ClientRow | undefined =>
  row.id === id ? row : row.children.map((child) => findRow(child, id)).find(Boolean);

import { useMemo } from 'react';
import type { Inconsistency } from '@app/domain/clients';
import { Avatar, Card, TreeTable, VisuallyHidden } from '@app/ui';
import { CLIENT_LEVEL, type ClientRow } from '../../../models/index.ts';
import { ClientValue } from './ClientValue.tsx';

export interface ClientsTableProps {
  company: ClientRow;
  months: string[];
  inconsistencies: Inconsistency[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ClientsTable({
  company,
  months,
  inconsistencies,
  selectedId,
  onSelect,
}: ClientsTableProps) {
  const items = useMemo(() => [company], [company]);
  const sumOfChildrenAt = useMemo(
    () =>
      new Map(
        inconsistencies.map((issue) => [
          `${issue.nodeId}:${issue.monthIndex}`,
          issue.sumOfChildren,
        ]),
      ),
    [inconsistencies],
  );

  return (
    <Card>
      <TreeTable
        aria-label="Clients per month"
        defaultExpandedKeys={[company.id]}
        selectedKey={selectedId}
        onSelectionChange={onSelect}
      >
        <TreeTable.Header>
          <TreeTable.Column isRowHeader>
            {/* Read by screen readers, hidden on screen (as in the design). */}
            <VisuallyHidden>Name</VisuallyHidden>
          </TreeTable.Column>
          {months.map((month) => (
            <TreeTable.Column key={month}>{month}</TreeTable.Column>
          ))}
        </TreeTable.Header>
        <TreeTable.Body items={items}>
          {(row) => (
            <TreeTable.Row item={row}>
              <TreeTable.NameCell>
                {row.level === CLIENT_LEVEL.adviser && <Avatar name={row.name} />}
                <span>{row.name}</span>
              </TreeTable.NameCell>
              {months.map((month, i) => (
                <TreeTable.Cell key={month}>
                  <ClientValue
                    value={row.values[i] ?? 0}
                    context={`${row.name}, ${month}`}
                    sumOfChildren={sumOfChildrenAt.get(`${row.id}:${i}`)}
                  />
                </TreeTable.Cell>
              ))}
            </TreeTable.Row>
          )}
        </TreeTable.Body>
      </TreeTable>
    </Card>
  );
}

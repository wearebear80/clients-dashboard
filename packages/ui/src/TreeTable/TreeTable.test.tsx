import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TreeTable } from './TreeTable.tsx';

interface Row {
  id: string;
  name: string;
  value: number;
  children?: Row[];
}

const nodes: Row[] = [
  {
    id: 'company',
    name: 'Company',
    value: 100,
    children: [
      {
        id: 'b1',
        name: 'Branch 1',
        value: 60,
        children: [
          {
            id: 'anna',
            name: 'Anna',
            value: 60,
            children: [{ id: 'paid', name: 'New paid', value: 5 }],
          },
        ],
      },
      { id: 'b2', name: 'Branch 2', value: 40 },
    ],
  },
];

function renderTable(
  defaultExpandedKeys: string[] = [],
  selection: { selectedKey?: string; onSelectionChange?: (key: string) => void } = {},
) {
  render(
    <TreeTable aria-label="Clients" defaultExpandedKeys={defaultExpandedKeys} {...selection}>
      <TreeTable.Header>
        <TreeTable.Column isRowHeader>Name</TreeTable.Column>
        <TreeTable.Column>Feb</TreeTable.Column>
      </TreeTable.Header>
      <TreeTable.Body items={nodes}>
        {(row) => (
          <TreeTable.Row item={row}>
            <TreeTable.NameCell>{row.name}</TreeTable.NameCell>
            <TreeTable.Cell>{row.value}</TreeTable.Cell>
          </TreeTable.Row>
        )}
      </TreeTable.Body>
    </TreeTable>,
  );
}

// A parent row's name starts with its chevron: "Expand Branch 1".
const rowName = (name: string) => new RegExp(`(^| )${name}$`);
const row = (name: string) => screen.getByRole('row', { name: rowName(name) });
const queryRow = (name: string) => screen.queryByRole('row', { name: rowName(name) });

describe('TreeTable', () => {
  it('exposes the hierarchy as a treegrid', () => {
    renderTable(['company']);

    expect(screen.getByRole('treegrid', { name: 'Clients' })).toBeInTheDocument();
    expect(row('Company')).toHaveAttribute('aria-level', '1');
    expect(row('Company')).toHaveAttribute('aria-expanded', 'true');
    expect(row('Branch 1')).toHaveAttribute('aria-level', '2');
    expect(row('Branch 1')).toHaveAttribute('aria-posinset', '1');
    expect(row('Branch 1')).toHaveAttribute('aria-setsize', '2');
    expect(row('Branch 1')).toHaveAttribute('aria-expanded', 'false');
    expect(row('Branch 2')).not.toHaveAttribute('aria-expanded');
  });

  it('expands and collapses rows on click', async () => {
    const user = userEvent.setup();
    renderTable();
    expect(queryRow('Branch 1')).not.toBeInTheDocument();

    await user.click(row('Company'));
    expect(row('Company')).toHaveAttribute('aria-expanded', 'true');
    expect(row('Branch 1')).toBeInTheDocument();

    await user.click(row('Company'));
    expect(queryRow('Branch 1')).not.toBeInTheDocument();
  });

  it('supports the treegrid keyboard model with a single tab stop', async () => {
    const user = userEvent.setup();
    renderTable();

    await user.tab();
    expect(row('Company')).toHaveFocus();

    await user.keyboard('{ArrowRight}'); // collapsed → expand
    expect(row('Company')).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{ArrowDown}');
    expect(row('Branch 1')).toHaveFocus();

    await user.keyboard('{Enter}'); // toggle
    expect(row('Anna')).toBeInTheDocument();

    await user.keyboard('{ArrowLeft}'); // expanded → collapse
    expect(queryRow('Anna')).not.toBeInTheDocument();

    await user.keyboard('{End}');
    expect(row('Branch 2')).toHaveFocus();

    await user.keyboard('{ArrowLeft}'); // child → parent
    expect(row('Company')).toHaveFocus();

    await user.keyboard('{ArrowLeft}'); // collapse
    expect(queryRow('Branch 1')).not.toBeInTheDocument();

    // Roving tabindex: only the focused row is in the tab order.
    const tabStops = screen.getAllByRole('row').filter((r) => r.tabIndex === 0);
    expect(tabStops).toEqual([row('Company')]);
  });

  it('selects one row by click or Space, without changing what is expanded', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    renderTable(['company'], { selectedKey: 'company', onSelectionChange });
    expect(row('Company')).toHaveAttribute('aria-selected', 'true');

    await user.click(row('Branch 2'));
    expect(onSelectionChange).toHaveBeenLastCalledWith('b2');
    expect(row('Branch 1')).toBeInTheDocument(); // the company stays expanded

    await user.keyboard('{ArrowUp}'); // focus moves, selection does not
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    await user.keyboard(' ');
    expect(onSelectionChange).toHaveBeenLastCalledWith('b1');
    expect(queryRow('Anna')).not.toBeInTheDocument(); // not expanded

    await user.keyboard('{ArrowRight}'); // expanding stays on the arrows and the chevron
    expect(row('Anna')).toBeInTheDocument();
  });
});

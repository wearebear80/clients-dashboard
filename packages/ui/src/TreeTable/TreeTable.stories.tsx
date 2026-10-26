import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '../Avatar/Avatar.tsx';
import { Card } from '../Card/Card.tsx';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.tsx';
import { TreeTable, type TreeTableProps } from './TreeTable.tsx';

interface Row {
  id: string;
  name: string;
  kind: 'company' | 'branch' | 'adviser' | 'channel';
  values: number[];
  children?: Row[];
}

const MONTHS = [
  'Feb 2024',
  'Mar 2024',
  'Apr 2024',
  'May 2024',
  'Jun 2024',
  'Jul 2024',
  'Aug 2024',
  'Sep 2024',
  'Oct 2024',
  'Nov 2024',
  'Dec 2024',
  'Jan 2025',
];

const adviser = (id: string, name: string, values: number[], children?: Row[]): Row => ({
  id,
  name,
  kind: 'adviser',
  values,
  children,
});

const COMPANY: Row = {
  id: 'company',
  name: 'Company',
  kind: 'company',
  values: [250, 267, 284, 301, 317, 334, 350, 250, 250, 250, 250, 350],
  children: [
    {
      id: 'branch-1',
      name: 'Branch 1',
      kind: 'branch',
      values: [147, 157, 166, 156, 188, 201, 214, 147, 147, 147, 147, 214],
      children: [
        adviser(
          'anna',
          'Anna Blackwood',
          [25, 26, 28, 31, 32, 34, 38, 27, 27, 27, 27, 38],
          [
            {
              id: 'existing',
              name: 'Existing clients',
              kind: 'channel',
              values: [25, 25, 26, 28, 31, 32, 34, 25, 25, 25, 25, 34],
            },
            {
              id: 'organic',
              name: 'New organic',
              kind: 'channel',
              values: [0, 1, 1, 1, 0, 2, 2, 1, 1, 1, 1, 2],
            },
            {
              id: 'paid',
              name: 'New paid',
              kind: 'channel',
              values: [0, 0, 1, 1, 2, 1, 0, 2, 1, 1, 1, 2],
            },
          ],
        ),
        adviser('james', 'James Walker', [12, 13, 14, 14, 15, 15, 16, 12, 12, 12, 12, 17]),
        adviser('maria', 'Maria Gutierrez', [36, 39, 41, 22, 46, 48, 51, 35, 35, 35, 35, 52]),
        adviser('robert', 'Robert Chen', [42, 43, 46, 47, 51, 55, 58, 41, 41, 41, 41, 54]),
        adviser('sarah', 'Sarah Smith', [32, 36, 37, 42, 44, 49, 53, 32, 32, 32, 32, 53]),
      ],
    },
    {
      id: 'branch-2',
      name: 'Branch 2',
      kind: 'branch',
      values: [76, 80, 84, 87, 90, 92, 94, 75, 75, 75, 75, 91],
    },
    {
      id: 'branch-3',
      name: 'Branch 3',
      kind: 'branch',
      values: [27, 30, 34, 36, 39, 41, 42, 28, 28, 28, 28, 45],
    },
  ],
};

function ClientsTreeTable({ defaultExpandedKeys }: Pick<TreeTableProps, 'defaultExpandedKeys'>) {
  return (
    <TreeTable aria-label="Clients per month" defaultExpandedKeys={defaultExpandedKeys}>
      <TreeTable.Header>
        <TreeTable.Column isRowHeader>
          <VisuallyHidden>Name</VisuallyHidden>
        </TreeTable.Column>
        {MONTHS.map((month) => (
          <TreeTable.Column key={month}>{month}</TreeTable.Column>
        ))}
      </TreeTable.Header>
      <TreeTable.Body items={[COMPANY]}>
        {(row) => (
          <TreeTable.Row item={row}>
            <TreeTable.NameCell>
              {row.kind === 'adviser' && <Avatar name={row.name} />}
              <span>{row.name}</span>
            </TreeTable.NameCell>
            {MONTHS.map((month, i) => (
              <TreeTable.Cell key={month}>{row.values[i]}</TreeTable.Cell>
            ))}
          </TreeTable.Row>
        )}
      </TreeTable.Body>
    </TreeTable>
  );
}

const meta = {
  title: 'UI/TreeTable',
  component: ClientsTreeTable,
  args: { defaultExpandedKeys: ['company'] },
  decorators: [
    (Story, { parameters }) => (
      <div style={{ maxWidth: parameters.containerWidth as number | undefined }}>
        <Card>
          <Story />
        </Card>
      </div>
    ),
  ],
} satisfies Meta<typeof ClientsTreeTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DeeplyExpanded: Story = {
  args: { defaultExpandedKeys: ['company', 'branch-1', 'anna'] },
};

export const Narrow: Story = {
  args: { defaultExpandedKeys: ['company', 'branch-1'] },
  parameters: { containerWidth: 343 },
};

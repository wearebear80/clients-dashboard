import {
  createContext,
  useContext,
  useState,
  type Context,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';
import { clsx } from 'clsx';
import {
  Button,
  Cell as AriaCell,
  Collection,
  Column as AriaColumn,
  Row as AriaRow,
  Table,
  TableBody,
  TableHeader,
  type Key,
} from 'react-aria-components';
import { ChevronIcon } from '../Icon/ChevronIcon.tsx';
import styles from './TreeTable.module.scss';

export interface TreeItem {
  id: string;
  children?: readonly TreeItem[];
}

interface TreeContextValue {
  expanded: Set<Key>;
  toggle: (id: string) => void;
  selectable: boolean;
}

interface BodyContextValue {
  renderRow: (item: TreeItem) => ReactElement;
  dependencies: readonly unknown[];
}

const TreeContext = createContext<TreeContextValue | null>(null);
const BodyContext = createContext<BodyContextValue | null>(null);

function useRequired<T>(context: Context<T | null>): T {
  const value = useContext(context);
  if (!value) throw new Error('TreeTable parts must be rendered inside <TreeTable>.');
  return value;
}

const TREE_COLUMN = 'name';

export interface TreeTableProps {
  'aria-label': string;
  /** `<TreeTable.Header>` and `<TreeTable.Body>`. */
  children: ReactNode;
  expandedKeys?: readonly string[];
  defaultExpandedKeys?: readonly string[];
  onExpandedChange?: (keys: string[]) => void;
  /** Makes one row selectable: click or Space selects it, and it gets `aria-selected`. */
  selectedKey?: string;
  onSelectionChange?: (key: string) => void;
  className?: string;
}

export function TreeTable({
  'aria-label': ariaLabel,
  children,
  expandedKeys,
  defaultExpandedKeys = [],
  onExpandedChange,
  selectedKey,
  onSelectionChange,
  className,
}: TreeTableProps) {
  const [ownExpanded, setOwnExpanded] = useState<Set<Key>>(() => new Set(defaultExpandedKeys));
  const expanded = expandedKeys ? new Set<Key>(expandedKeys) : ownExpanded;

  const setExpanded = (keys: Set<Key>) => {
    if (!expandedKeys) setOwnExpanded(keys);
    onExpandedChange?.([...keys].map(String));
  };

  const toggle = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  return (
    <TreeContext.Provider value={{ expanded, toggle, selectable: Boolean(onSelectionChange) }}>
      <div className={clsx(styles.scroller, className)}>
        <Table
          aria-label={ariaLabel}
          treeColumn={TREE_COLUMN}
          expandedKeys={expanded}
          onExpandedChange={setExpanded}
          {...(onSelectionChange && {
            selectionMode: 'single',
            selectionBehavior: 'toggle',
            disallowEmptySelection: true,
            selectedKeys: selectedKey ? [selectedKey] : [],
            onSelectionChange: (keys) => {
              const [key] = keys === 'all' ? [] : keys;
              if (key !== undefined) onSelectionChange(String(key));
            },
          })}
          className={styles.table}
        >
          {children}
        </Table>
      </div>
    </TreeContext.Provider>
  );
}

function Header({ children }: { children: ReactNode }) {
  return <TableHeader>{children}</TableHeader>;
}

export interface TreeTableBodyProps<T extends TreeItem> {
  /** Top-level rows; deeper rows come from each item's `children`. */
  items: readonly T[];
  /** Renders one `<TreeTable.Row>` per item, at any depth. */
  children: (item: T) => ReactElement;
}

function Body<T extends TreeItem>({ items, children: renderRow }: TreeTableBodyProps<T>) {
  const { expanded } = useRequired(TreeContext);
  // React Aria caches rows: they re-render when the row function or the expansion changes.
  const dependencies = [expanded, renderRow];

  return (
    <BodyContext.Provider
      value={{ renderRow: renderRow as (item: TreeItem) => ReactElement, dependencies }}
    >
      <TableBody items={items} dependencies={dependencies}>
        {renderRow}
      </TableBody>
    </BodyContext.Provider>
  );
}

export interface TreeTableColumnProps {
  children: ReactNode;
  /** The tree column: holds the chevrons and indentation. Exactly one, first. */
  isRowHeader?: boolean;
}

function Column({ children, isRowHeader }: TreeTableColumnProps) {
  return isRowHeader ? (
    <AriaColumn id={TREE_COLUMN} isRowHeader className={styles.nameHeader}>
      {children}
    </AriaColumn>
  ) : (
    <AriaColumn className={styles.header}>{children}</AriaColumn>
  );
}

export interface TreeTableRowProps<T extends TreeItem> {
  item: T;
  children: ReactNode;
  onAction?: (item: T) => void;
}

function Row<T extends TreeItem>({ item, children, onAction }: TreeTableRowProps<T>) {
  const { toggle, selectable } = useRequired(TreeContext);
  const { renderRow, dependencies } = useRequired(BodyContext);
  const childItems = item.children ?? [];

  return (
    <AriaRow
      id={item.id}
      className={styles.row}
      onAction={
        onAction
          ? () => onAction(item)
          : !selectable && childItems.length > 0
            ? () => toggle(item.id)
            : undefined
      }
    >
      {children}
      <Collection items={childItems} dependencies={dependencies}>
        {renderRow}
      </Collection>
    </AriaRow>
  );
}

function NameCell({ children }: { children: ReactNode }) {
  return (
    <AriaCell className={styles.nameCell}>
      {({ hasChildItems, isExpanded, level }) => (
        <span className={styles.name} style={{ '--level': level - 1 } as CSSProperties}>
          {hasChildItems ? (
            <Button slot="chevron" className={styles.chevron}>
              <ChevronIcon expanded={isExpanded} />
            </Button>
          ) : (
            <span className={styles.chevronSpacer} />
          )}
          {children}
        </span>
      )}
    </AriaCell>
  );
}

function Cell({ children }: { children: ReactNode }) {
  return <AriaCell className={styles.cell}>{children}</AriaCell>;
}

TreeTable.Header = Header;
TreeTable.Body = Body;
TreeTable.Column = Column;
TreeTable.Row = Row;
TreeTable.NameCell = NameCell;
TreeTable.Cell = Cell;

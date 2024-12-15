import clsx from 'clsx';

import IconChevronDown from '~icons/tabler/chevron-down';
import IconChevronRight from '~icons/tabler/chevron-right';

import { type JsonTreeNode } from '../../../utils/json-tree';
import styles from './styles.module.css';

interface TreeRowProps {
  item: JsonTreeNode;
  height?: number;
  onToggleExpand: (node: JsonTreeNode) => void;
  isSelected?: boolean;
  onSelect?: (node: JsonTreeNode) => void;
  isReadOnly?: boolean;
}

export function TreeRow({ item, height, onToggleExpand, isSelected, onSelect }: TreeRowProps) {
  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(`.${styles.expandIcon}`) || (e.target as HTMLElement).closest(`.${styles.linkValue}`)) {
      return;
    }

    onSelect?.(item);
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.isArray || item.isObject) {
      onToggleExpand(item);
    }
  };

  // 渲染缩进空格
  const renderIndent = () => {
    return <span className={styles.indent}>{'\u00A0'.repeat(item.level * 2)}</span>;
  };

  // 渲染展开/折叠图标
  const renderExpandIcon = () => {
    if ((item.isArray || item.isObject) && !item.isEnd) {
      return (
        <span className={clsx(styles.expandIcon, item.isExpanded && styles.expanded)} onClick={handleExpandClick}>
          {item.isExpanded ? <IconChevronDown /> : <IconChevronRight />}
        </span>
      );
    }
    return <span className={styles.expandPlaceholder} />;
  };

  // 渲染键名
  const renderKey = () => {
    if (item.isEnd) return null;

    const key = item.paths[item.paths.length - 1];
    const showKey = typeof key === 'string' && !key.match(/^\d+$/);

    if (!showKey) return null;

    return (
      <span className={styles.key} onClick={(e) => e.stopPropagation()}>
        {key}
        {(item.isArray || item.isObject || item.isPrimitive) && ': '}
      </span>
    );
  };

  // 新增：格式化值的显示
  const formatValue = (value: any, format: JsonTreeNode['valueFormat']) => {
    if (!value || typeof value !== 'string') return JSON.stringify(value);

    switch (format) {
      case 'url':
        return (
          <>
            {'"'}
            <a href={value} target='_blank' rel='noopener noreferrer' onClick={(e) => e.stopPropagation()} className={styles.linkValue}>
              {value}
            </a>
            {'"'}
          </>
        );
      case 'email':
        return (
          <>
            {'"'}
            <a href={`mailto:${value}`} onClick={(e) => e.stopPropagation()} className={styles.linkValue}>
              {value}
            </a>
            {'"'}
          </>
        );
      case 'date':
        return new Date(value).toLocaleString();
      case 'json':
        try {
          return JSON.stringify(JSON.parse(value), null, 2);
        } catch {
          return value;
        }
      default:
        return JSON.stringify(value);
    }
  };

  // 修改 renderValue 方法中的原始值渲染部分
  const renderPrimitiveValue = () => {
    return (
      <span
        className={clsx(styles.value, {
          [styles.stringValue]: item.primitiveType === 'string',
          [styles.numberValue]: item.primitiveType === 'number',
          [styles.booleanValue]: item.primitiveType === 'boolean',
          [styles.nullValue]: item.primitiveType === 'null',
          [styles.specialValue]: item.valueFormat !== 'plain',
        })}
        onClick={(e) => e.stopPropagation()}
      >
        {formatValue(item.value, item.valueFormat)}
      </span>
    );
  };

  // 渲染值
  const renderValue = () => {
    if (item.isPrimitive) {
      return renderPrimitiveValue();
    }

    if (item.isEnd) {
      return <span className={styles.bracket}>{item.isArray ? ']' : '}'}</span>;
    }

    if (item.isStart || (!item.isEnd && (item.isArray || item.isObject))) {
      return (
        <>
          <span className={styles.bracket}>{item.isArray ? '[' : '{'}</span>
          {!item.isExpanded && (
            <span className={styles.collapsedInfo}>
              {item.isArray ? 'Array[' : 'Object{'}
              <span className={styles.length} onClick={handleClick}>
                {item.length}
              </span>
              {item.isArray ? ']' : '}'}
            </span>
          )}
          {item.isExpanded && item.length === 0 && <span className={styles.bracket}>{item.isArray ? ']' : '}'}</span>}
          {!item.isExpanded && (item.isArray || item.isObject) && <span className={styles.bracket}>{item.isArray ? ']' : '}'}</span>}
        </>
      );
    }

    return null;
  };

  return (
    <div
      className={clsx(styles.treeRow, {
        [styles.selected]: isSelected,
      })}
      style={{
        height,
      }}
      onClick={handleClick}
    >
      {renderIndent()}
      {renderExpandIcon()}
      {renderKey()}
      {renderValue()}
    </div>
  );
}

import type { CSSProperties } from 'react';
import type { AstNode } from 'simple-parser';

interface AstTreeProps {
  node: AstNode;
  depth?: number;
}

function renderLabel(node: AstNode): string {
  if (node.type === 'element') {
    return `<${node.name ?? 'неизвестно'}>`;
  }

  if (node.type === 'text') {
    return `текст: ${node.value ?? ''}`;
  }

  if (node.type === 'comment') {
    return `комментарий: ${node.value ?? ''}`;
  }

  if (node.type === 'directive') {
    return `директива: ${node.value ?? ''}`;
  }

  return 'корень';
}

export function AstTree({ node, depth = 0 }: AstTreeProps) {
  const children = node.children ?? [];

  return (
    <li className="tree-node" style={{ '--depth': depth } as CSSProperties}>
      <details open={depth < 2}>
        <summary>
          <span className={`tree-type tree-type-${node.type}`}>{node.type}</span>
          <code>{renderLabel(node)}</code>
        </summary>

        {children.length > 0 ? (
          <ul>
            {children.map((child, index) => (
              <AstTree key={`${child.type}-${index}-${depth}`} node={child} depth={depth + 1} />
            ))}
          </ul>
        ) : null}
      </details>
    </li>
  );
}

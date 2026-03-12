import type { Token } from 'simple-parser';

interface TokenTableProps {
  tokens: Token[];
}

export function TokenTable({ tokens }: TokenTableProps) {
  if (tokens.length === 0) {
    return <p className="muted">Извлечение токенов отключено для этого запуска.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Тип</th>
            <th>Значение</th>
            <th>Диапазон</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, index) => (
            <tr key={`${token.type}-${token.start}-${index}`}>
              <td className="token-type-cell">
                <span className={`token-badge token-${token.type}`}>{token.type}</span>
              </td>
              <td className="token-value-cell">
                <code className="token-value">{token.value}</code>
              </td>
              <td className="token-range-cell">
                {token.start}-{token.end}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import type { Token } from 'simple-parser';

interface TokenTableProps {
  tokens: Token[];
}

export function TokenTable({ tokens }: TokenTableProps) {
  if (tokens.length === 0) {
    return <p className="muted">Token extraction is disabled for this parse run.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Value</th>
            <th>Range</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, index) => (
            <tr key={`${token.type}-${token.start}-${index}`}>
              <td>
                <span className={`token-badge token-${token.type}`}>{token.type}</span>
              </td>
              <td>
                <code>{token.value}</code>
              </td>
              <td>
                {token.start}-{token.end}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

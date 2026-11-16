import { formatDate, formatMoney } from "@/lib/format";
import type { Backer } from "@/lib/types";

export function BackersList({ backers }: { backers: Backer[] }) {
  if (!backers.length) {
    return (
      <div className="info-card">
        <h3>No confirmed backers listed yet</h3>
        <p>
          Backers appear after the payment provider confirms a successful gift.
          Anonymous supporters are shown simply as Anonymous.
        </p>
      </div>
    );
  }

  return (
    <ul className="backer-list" aria-label="Recent confirmed backers">
      {backers.map((backer) => (
        <li key={backer.id}>
          <div>
            <strong>{backer.displayName}</strong>
            <span>{formatDate(backer.createdAt)}</span>
          </div>
          <span>{formatMoney(backer.amount, backer.currency)}</span>
        </li>
      ))}
    </ul>
  );
}

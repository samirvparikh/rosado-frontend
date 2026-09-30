import { Link } from "react-router-dom";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-nav text-stone">
      <ol className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href ? (
              <Link to={item.href} className="hover:text-charcoal">
                {item.label}
              </Link>
            ) : (
              <span className="text-charcoal">{item.label}</span>
            )}
            {index < items.length - 1 ? <span aria-hidden="true">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

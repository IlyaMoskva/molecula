export function Formula({ value }: { readonly value: string }) {
  const parts = value.split(/(\d+)/).filter(Boolean);
  return (
    <span className="formula" aria-label={value}>
      <span aria-hidden="true">
        {parts.map((part, index) =>
          /^\d+$/.test(part) ? (
            <sub key={`${part}-${String(index)}`}>{part}</sub>
          ) : (
            <span key={`${part}-${String(index)}`}>{part}</span>
          ),
        )}
      </span>
    </span>
  );
}

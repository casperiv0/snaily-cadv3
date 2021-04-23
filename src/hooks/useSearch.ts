import * as React from "react";

export function useSearch<T = object>(key: keyof T, items: T[]) {
  const [search, setSearch] = React.useState("");
  const [filtered, setFiltered] = React.useState<T[]>(items);

  React.useEffect(() => {
    setFiltered(items);
  }, [items]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearch(value);

    if (value.length <= 0) {
      setFiltered(items);
    } else {
      setFiltered(
        items.filter((v) =>
          ((v[key] as unknown) as string).toString().toLowerCase().includes(value.toLowerCase()),
        ),
      );
    }
  }

  return {
    search,
    filtered,
    onChange,
  };
}

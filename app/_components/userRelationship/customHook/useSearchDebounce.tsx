import { useEffect, useState } from "react";

export default function useSearchDebounce(searchValue: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(searchValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue, delay]);

  return debouncedValue;
}

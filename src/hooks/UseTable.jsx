import { useState, useMemo } from "react";

export default function useTable(initialData = []) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(null); // {key: value}
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"

  const filteredData = useMemo(() => {
    let data = [...initialData];

    // Search
    if (search) {
      data = data.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // Filter
    if (filter) {
      Object.keys(filter).forEach((key) => {
        data = data.filter((item) => item[key] === filter[key]);
      });
    }

    // Sort
    if (sortKey) {
      data.sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [initialData, search, filter, sortKey, sortOrder]);

  const handleSearch = (value) => setSearch(value);
  const handleFilter = (key, value) => setFilter({ [key]: value });
  const handleSort = (key, order = "asc") => {
    setSortKey(key);
    setSortOrder(order);
  };

  return {
    tableData: filteredData,
    search,
    filter,
    sortKey,
    sortOrder,
    handleSearch,
    handleFilter,
    handleSort,
  };
}

function getUniqueValues(values: (string | null | number)[]) {
  const items: (string | number)[] = [];
  for (const value of values) {
    if (value && !items.includes(value)) {
      items.push(value);
    }
  }
  return items;
}

export default getUniqueValues;

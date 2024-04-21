function uniqueValues(values: string[]) {
  const items: string[] = [];
  for (const value of values) {
    if (!items.includes(value.trim())) {
      items.push(value.trim());
    }
  }
  return items;
}

export default uniqueValues;

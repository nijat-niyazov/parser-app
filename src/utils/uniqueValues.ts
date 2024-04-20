function uniqueValues(values: string[]) {
  const items: string[] = [];
  for (const value of values) {
    if (!items.includes(value)) {
      items.push(value);
    }
  }
  return items;
}

export default uniqueValues;

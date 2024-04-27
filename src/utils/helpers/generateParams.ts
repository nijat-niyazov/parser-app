function generateParams(obj: { [k: string]: string }) {
  const generatedParams: { [k: string]: string } = {};
  for (const [key, value] of Object.entries(obj)) {
    generatedParams[key] = value.startsWith('[') ? JSON.parse(value) : value;
  }

  return generatedParams;
}

export default generateParams;

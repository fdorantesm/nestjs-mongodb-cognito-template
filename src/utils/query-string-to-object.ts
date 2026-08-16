export function queryStringToObject<T>(queryString: string): T {
  const searchParams = new URLSearchParams(queryString);
  return Array.from(searchParams.entries()).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: value,
    };
  }, {} as T);
}

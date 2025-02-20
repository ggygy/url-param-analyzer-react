export function getABTestDataFromPage() {
  try {
    // @ts-ignore
    const nextData = window.__NEXT_DATA__?.props?.pageProps?.abTest;
    return nextData || null;
  } catch (error) {
    console.error('Failed to get AB test data:', error);
    return null;
  }
}

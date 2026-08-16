/**
 * Wait for async event handlers to complete before closing the application context.
 * This ensures that event handlers triggered by data creation have time to execute
 * and persist their side effects (e.g., wallets, Stripe customers) before the script terminates.
 * @param delayMs - Delay in milliseconds (default: 1000ms)
 */
export async function waitForHandlers(delayMs: number = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

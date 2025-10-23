// Retry utilities for handling failed API calls and network issues

export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoffMultiplier?: number;
  maxDelay?: number;
}

const defaultOptions: Required<RetryOptions> = {
  maxAttempts: 3,
  delay: 1000,
  backoffMultiplier: 2,
  maxDelay: 10000,
};

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const opts = { ...defaultOptions, ...options };
  let lastError: Error;
  
  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on the last attempt
      if (attempt === opts.maxAttempts) {
        throw lastError;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        opts.delay * Math.pow(opts.backoffMultiplier, attempt - 1),
        opts.maxDelay
      );
      
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, error);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

export const isRetryableError = (error: any): boolean => {
  if (!error) return false;
  
  // Network errors
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
    return true;
  }
  
  // HTTP status codes that should be retried
  if (error.status || error.response?.status) {
    const status = error.status || error.response.status;
    return status >= 500 || status === 429; // Server errors and rate limiting
  }
  
  // Timeout errors
  if (error.code === 'TIMEOUT' || error.message?.includes('timeout')) {
    return true;
  }
  
  return false;
};

export const withRetry = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options?: RetryOptions
) => {
  return async (...args: T): Promise<R> => {
    return retryWithBackoff(() => fn(...args), options);
  };
};






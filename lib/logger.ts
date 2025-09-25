type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    const errorStr = error ? ` | Error: ${error.message}${error.stack ? `\n${error.stack}` : ''}` : '';

    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}${errorStr}`;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const formattedMessage = this.formatMessage(level, message, context, error);

    switch (level) {
      case 'debug':
        if (process.env.NODE_ENV === 'development') {
          console.debug(formattedMessage);
        }
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
        break;
    }

    // In production, you might want to send logs to a service like DataDog, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implement production logging service
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>, error?: Error) {
    this.log('warn', message, context, error);
  }

  error(message: string, context?: Record<string, any>, error?: Error) {
    this.log('error', message, context, error);
  }

  // Specialized logging methods
  apiRequest(endpoint: string, method: string, statusCode: number, duration: number, context?: Record<string, any>) {
    this.info(`API ${method} ${endpoint}`, {
      ...context,
      statusCode,
      duration: `${duration}ms`,
    });
  }

  userAction(userId: string, action: string, context?: Record<string, any>) {
    this.info(`User ${userId} performed: ${action}`, {
      userId,
      action,
      ...context,
    });
  }

  blockchainTransaction(txHash: string, action: string, success: boolean, context?: Record<string, any>) {
    this.info(`Blockchain transaction: ${action}`, {
      txHash,
      success,
      ...context,
    });
  }

  farcasterInteraction(fid: number, action: string, success: boolean, context?: Record<string, any>) {
    this.info(`Farcaster interaction: ${action}`, {
      fid,
      success,
      ...context,
    });
  }

  rewardEvent(userId: string, amount: number, reason: string, context?: Record<string, any>) {
    this.info(`Reward issued to user ${userId}`, {
      userId,
      amount,
      reason,
      ...context,
    });
  }
}

export const logger = new Logger();

// Request logging middleware helper
export const logApiRequest = async (
  endpoint: string,
  method: string,
  startTime: number,
  statusCode: number,
  context?: Record<string, any>
) => {
  const duration = Date.now() - startTime;
  logger.apiRequest(endpoint, method, statusCode, duration, context);
};

// Performance monitoring
export const measurePerformance = async <T>(
  operation: string,
  fn: () => Promise<T>,
  context?: Record<string, any>
): Promise<T> => {
  const startTime = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    logger.debug(`Performance: ${operation} completed in ${duration}ms`, {
      operation,
      duration,
      ...context,
    });
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`Performance: ${operation} failed after ${duration}ms`, {
      operation,
      duration,
      ...context,
    }, error as Error);
    throw error;
  }
};


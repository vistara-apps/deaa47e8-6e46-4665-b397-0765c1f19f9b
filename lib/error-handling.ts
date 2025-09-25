import { NextResponse } from 'next/server';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: unknown, context: string = 'API') => {
  console.error(`[${context}] Error:`, error);

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    // Log detailed error for debugging
    console.error(`[${context}] Stack trace:`, error.stack);

    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      error: 'Unknown error occurred',
      code: 'UNKNOWN_ERROR',
    },
    { status: 500 }
  );
};

export const withErrorHandler = (
  handler: (request: Request, context?: any) => Promise<Response>
) => {
  return async (request: Request, context?: any) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleApiError(error, 'API Handler');
    }
  };
};

// Validation helpers
export const validateRequired = (value: any, fieldName: string) => {
  if (!value) {
    throw new AppError(`${fieldName} is required`, 400, 'VALIDATION_ERROR');
  }
};

export const validateNumber = (value: any, fieldName: string, min?: number, max?: number) => {
  const num = Number(value);
  if (isNaN(num)) {
    throw new AppError(`${fieldName} must be a valid number`, 400, 'VALIDATION_ERROR');
  }
  if (min !== undefined && num < min) {
    throw new AppError(`${fieldName} must be at least ${min}`, 400, 'VALIDATION_ERROR');
  }
  if (max !== undefined && num > max) {
    throw new AppError(`${fieldName} must be at most ${max}`, 400, 'VALIDATION_ERROR');
  }
  return num;
};

export const validateString = (value: any, fieldName: string, maxLength?: number) => {
  if (typeof value !== 'string') {
    throw new AppError(`${fieldName} must be a string`, 400, 'VALIDATION_ERROR');
  }
  if (maxLength && value.length > maxLength) {
    throw new AppError(`${fieldName} must be at most ${maxLength} characters`, 400, 'VALIDATION_ERROR');
  }
  return value.trim();
};

export const validateAddress = (address: string, fieldName: string = 'address') => {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new AppError(`${fieldName} must be a valid Ethereum address`, 400, 'VALIDATION_ERROR');
  }
  return address;
};

// Rate limiting helper (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): boolean => {
  const now = Date.now();
  const existing = rateLimitMap.get(identifier);

  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (existing.count >= maxRequests) {
    return false;
  }

  existing.count++;
  return true;
};

export const withRateLimit = (
  handler: (request: Request) => Promise<Response>,
  maxRequests: number = 10,
  windowMs: number = 60000
) => {
  return async (request: Request) => {
    const clientId = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'anonymous';

    if (!checkRateLimit(clientId, maxRequests, windowMs)) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(windowMs / 1000).toString(),
          },
        }
      );
    }

    return handler(request);
  };
};


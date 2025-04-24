import { PostgrestError } from '@supabase/supabase-js';

// Standard API response format
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Error codes
export enum ErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
}

/**
 * API service for handling API requests with standardized responses
 */
export class ApiService {
  /**
   * Handle successful API responses
   */
  static success<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data,
    };
  }

  /**
   * Handle API errors
   */
  static error<T>(code: ErrorCode, message: string, details?: any): ApiResponse<T> {
    return {
      success: false,
      error: {
        code,
        message,
        details,
      },
    };
  }

  /**
   * Handle Supabase errors
   */
  static handleSupabaseError<T>(error: PostgrestError): ApiResponse<T> {
    console.error('Supabase error:', error);

    let code = ErrorCode.SERVER_ERROR;
    let message = 'An unexpected error occurred';

    // Handle different error codes
    switch (error.code) {
      case '42P01': // Table not found
      case '42703': // Column not found
        code = ErrorCode.NOT_FOUND;
        message = 'The requested resource was not found';
        break;
      case '23505': // Unique violation
        code = ErrorCode.VALIDATION_ERROR;
        message = 'A resource with this identifier already exists';
        break;
      case '42501': // Permission denied
      case '42P04': // No SELECT permission
        code = ErrorCode.FORBIDDEN;
        message = 'You do not have permission to access this resource';
        break;
      case '22023': // Invalid parameter value
      case '22P02': // Invalid text representation
        code = ErrorCode.VALIDATION_ERROR;
        message = 'Invalid parameter value';
        break;
      default:
        if (error.message.includes('JWT')) {
          code = ErrorCode.UNAUTHORIZED;
          message = 'Authentication required';
        }
        break;
    }

    return this.error(code, message, { originalError: error });
  }

  /**
   * Wrap an async API function with error handling
   */
  static async wrapApiCall<T>(apiFunction: () => Promise<T>): Promise<ApiResponse<T>> {
    try {
      const result = await apiFunction();
      return this.success(result);
    } catch (error) {
      console.error('API error:', error);

      if ((error as PostgrestError).code) {
        return this.handleSupabaseError<T>(error as PostgrestError);
      }

      return this.error(ErrorCode.SERVER_ERROR, 'An unexpected error occurred', error);
    }
  }

  /**
   * Validate request parameters
   */
  static validateParams(
    params: Record<string, any>,
    required: string[] = []
  ): ApiResponse<null> | null {
    const missingParams = required.filter(param => params[param] === undefined);

    if (missingParams.length > 0) {
      return this.error(ErrorCode.VALIDATION_ERROR, 'Missing required parameters', {
        missingParams,
      });
    }

    return null;
  }
}

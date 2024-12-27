export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Not authorized') {
    super(message, 'AUTH_ERROR', 401)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404)
  }
} 
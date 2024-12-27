type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  timestamp: Date
  level: LogLevel
  message: string
  data?: any
  error?: Error
}

export class Logger {
  private static logs: LogEntry[] = []
  private static readonly MAX_LOGS = 1000

  private static log(level: LogLevel, message: string, data?: any, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data,
      error
    }

    console.log(`[${entry.timestamp.toISOString()}] ${level.toUpperCase()}: ${message}`)
    if (data) console.log('Data:', data)
    if (error) console.error('Error:', error)

    this.logs.unshift(entry)
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.pop()
    }
  }

  static info(message: string, data?: any) {
    this.log('info', message, data)
  }

  static warn(message: string, data?: any) {
    this.log('warn', message, data)
  }

  static error(message: string, error?: Error, data?: any) {
    this.log('error', message, data, error)
  }

  static debug(message: string, data?: any) {
    if (process.env.NODE_ENV !== 'production') {
      this.log('debug', message, data)
    }
  }

  static getLogs(level?: LogLevel): LogEntry[] {
    return level 
      ? this.logs.filter(log => log.level === level)
      : this.logs
  }

  static clearLogs() {
    this.logs = []
  }
} 
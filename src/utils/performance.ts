interface PerformanceMetric {
  operation: string
  startTime: number
  endTime: number
  duration: number
  success: boolean
  metadata?: Record<string, any>
}

export class PerformanceMonitor {
  private static metrics: PerformanceMetric[] = []
  private static readonly MAX_METRICS = 1000
  private static readonly SLOW_QUERY_THRESHOLD = 100 // milliseconds

  static startOperation(operation: string, metadata?: Record<string, any>): string {
    const id = crypto.randomUUID()
    this.metrics.push({
      operation,
      startTime: performance.now(),
      endTime: 0,
      duration: 0,
      success: false,
      metadata
    })
    return id
  }

  static endOperation(operation: string, success: boolean = true) {
    const metric = this.metrics.find(m => m.operation === operation && m.endTime === 0)
    if (metric) {
      metric.endTime = performance.now()
      metric.duration = metric.endTime - metric.startTime
      metric.success = success

      // Log slow operations
      if (metric.duration > this.SLOW_QUERY_THRESHOLD) {
        console.warn(`Slow operation detected: ${operation} took ${metric.duration.toFixed(2)}ms`, 
          metric.metadata)
      }
    }

    // Maintain max size
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics.shift()
    }
  }

  static getMetrics() {
    return [...this.metrics]
  }

  static getAverageOperationTime(operation: string): number {
    const relevantMetrics = this.metrics.filter(
      m => m.operation === operation && m.success
    )
    if (relevantMetrics.length === 0) return 0

    const totalTime = relevantMetrics.reduce((sum, m) => sum + m.duration, 0)
    return totalTime / relevantMetrics.length
  }

  static getSlowOperations(threshold: number = this.SLOW_QUERY_THRESHOLD): PerformanceMetric[] {
    return this.metrics.filter(m => m.duration > threshold)
  }

  static clearMetrics() {
    this.metrics = []
  }
} 
/**
 * WARDROBE AI - Application Metrics & Observability Collector
 * Tracks API Latency, AI Response Times, Queue Depths, and Error Rates.
 */

interface MetricPoint {
  name: string;
  value: number;
  tags?: Record<string, string>;
  timestamp: number;
}

class MetricsCollector {
  private metrics: MetricPoint[] = [];

  public recordLatency(endpoint: string, latencyMs: number, status: number) {
    this.metrics.push({
      name: 'api_latency_ms',
      value: latencyMs,
      tags: { endpoint, status: status.toString() },
      timestamp: Date.now(),
    });
  }

  public recordAiLatency(operation: string, latencyMs: number, success: boolean) {
    this.metrics.push({
      name: 'ai_latency_ms',
      value: latencyMs,
      tags: { operation, success: success.toString() },
      timestamp: Date.now(),
    });
  }

  public recordError(type: string, code = '500') {
    this.metrics.push({
      name: 'error_count',
      value: 1,
      tags: { type, code },
      timestamp: Date.now(),
    });
  }

  public getSummary() {
    return {
      totalRecorded: this.metrics.length,
      recentMetrics: this.metrics.slice(-20),
    };
  }
}

export const metrics = new MetricsCollector();

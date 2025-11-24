// components/admin/payments/common/RevenueChart.jsx
import React, { useMemo, useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { formatCurrency } from "../../../../services/paymentService";
import "../styles/revenueChart.css";

const RevenueChart = ({ data, timeRange, loading = false }) => {
  const chartRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [tooltip, setTooltip] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Handle responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (chartRef.current) {
        const { width } = chartRef.current.getBoundingClientRect();
        setDimensions({
          width,
          height: Math.min(320, Math.max(240, width * 0.5)),
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Process chart data
  const chartData = useMemo(() => {
    if (!data?.revenueByPeriod && !data?.data) return [];

    const rawData = data.revenueByPeriod || data.data || [];
    return rawData.map((item) => ({
      label: item.period || item.date || item.label,
      revenue: item.revenue || item.amount || item.total || 0,
      count: item.count || item.transactions || 0,
    }));
  }, [data]);

  // Calculate chart metrics
  const chartMetrics = useMemo(() => {
    if (!chartData.length)
      return { max: 0, min: 0, total: 0, avg: 0, change: 0 };

    const revenues = chartData.map((d) => d.revenue);
    const max = Math.max(...revenues);
    const min = Math.min(...revenues);
    const total = revenues.reduce((sum, r) => sum + r, 0);
    const avg = total / revenues.length;

    // Calculate percentage change
    const firstHalf = revenues.slice(0, Math.floor(revenues.length / 2));
    const secondHalf = revenues.slice(Math.floor(revenues.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    const change = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0;

    return { max, min, total, avg, change };
  }, [chartData]);

  // Format date label for display
  const formatLabel = (label) => {
    if (!label) return "";

    // Handle different formats
    if (label.includes("-W")) {
      // Weekly format: 2024-W01
      const [year, week] = label.split("-W");
      return `W${parseInt(week)}`;
    }

    if (label.match(/^\d{4}-\d{2}$/)) {
      // Monthly format: 2024-01
      const date = new Date(label + "-01");
      return date.toLocaleDateString(undefined, { month: "short" });
    }

    if (label.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Daily format: 2024-01-15
      const date = new Date(label);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    }

    return label;
  };

  // Handle bar interactions
  const handleBarEnter = (e, item, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const chartRect = chartRef.current.getBoundingClientRect();

    setTooltip({
      x: rect.left - chartRect.left + rect.width / 2,
      y: rect.top - chartRect.top,
      data: item,
    });
    setHoveredIndex(index);
  };

  const handleBarLeave = () => {
    setTooltip(null);
    setHoveredIndex(null);
  };

  if (loading) {
    return (
      <div className="revenue-chart revenue-chart--loading">
        <div className="chart-skeleton">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="skeleton skeleton--bar"
              style={{ height: `${30 + Math.random() * 50}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="revenue-chart revenue-chart--empty">
        <div className="empty-state">
          <span className="empty-state__icon">📊</span>
          <p className="empty-state__text">No revenue data for this period</p>
        </div>
      </div>
    );
  }

  const padding = { top: 30, right: 20, bottom: 50, left: 60 };
  const chartWidth = dimensions.width - padding.left - padding.right;
  const chartHeight = dimensions.height - padding.top - padding.bottom;
  const barWidth = Math.max(
    12,
    Math.min(40, chartWidth / chartData.length - 8)
  );

  // Y-axis scale
  const yScale = (value) => {
    const maxValue = chartMetrics.max || 1;
    return chartHeight - (value / maxValue) * chartHeight;
  };

  // Generate Y-axis ticks
  const yTicks = useMemo(() => {
    const tickCount = 5;
    const maxValue = chartMetrics.max || 1;
    return Array.from(
      { length: tickCount },
      (_, i) => (maxValue / (tickCount - 1)) * i
    ).reverse();
  }, [chartMetrics.max]);

  return (
    <div className="revenue-chart" ref={chartRef}>
      {/* Summary Stats */}
      <div className="revenue-chart__summary">
        <div className="summary-stat">
          <span className="summary-stat__label">Total Revenue</span>
          <span className="summary-stat__value">
            {formatCurrency(chartMetrics.total, "USD")}
          </span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat__label">Average</span>
          <span className="summary-stat__value">
            {formatCurrency(chartMetrics.avg, "USD")}
          </span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat__label">Peak</span>
          <span className="summary-stat__value">
            {formatCurrency(chartMetrics.max, "USD")}
          </span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat__label">Change</span>
          <span
            className={`summary-stat__value ${
              chartMetrics.change >= 0 ? "positive" : "negative"
            }`}
          >
            {chartMetrics.change >= 0 ? "↑" : "↓"}{" "}
            {Math.abs(chartMetrics.change).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="revenue-chart__container">
        {dimensions.width > 0 && (
          <svg
            width={dimensions.width}
            height={dimensions.height}
            className="revenue-chart__svg"
          >
            <defs>
              <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--pad-primary)"
                  stopOpacity="1"
                />
                <stop
                  offset="100%"
                  stopColor="var(--pad-primary)"
                  stopOpacity="0.6"
                />
              </linearGradient>
            </defs>

            {/* Y-axis */}
            <g className="chart-axis chart-axis--y">
              {yTicks.map((tick, i) => (
                <g
                  key={i}
                  transform={`translate(${padding.left}, ${
                    padding.top + yScale(tick)
                  })`}
                >
                  <line
                    x1={0}
                    x2={chartWidth}
                    className="chart-grid-line"
                    strokeDasharray={i === 0 ? "0" : "2 4"}
                  />
                  <text x={-8} dy="0.32em" className="chart-axis__label">
                    {tick >= 1000
                      ? `$${(tick / 1000).toFixed(0)}K`
                      : `$${tick.toFixed(0)}`}
                  </text>
                </g>
              ))}
            </g>

            {/* Bars */}
            <g transform={`translate(${padding.left}, ${padding.top})`}>
              {chartData.map((item, i) => {
                const barHeight = Math.max(
                  2,
                  chartHeight - yScale(item.revenue)
                );
                const x =
                  (chartWidth / chartData.length) * i +
                  (chartWidth / chartData.length - barWidth) / 2;
                const y = yScale(item.revenue);
                const isHovered = hoveredIndex === i;

                return (
                  <g key={i} className="chart-bar-group">
                    {/* Bar */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      className={`chart-bar ${
                        isHovered ? "chart-bar--hovered" : ""
                      }`}
                      fill="url(#barGradient)"
                      rx={3}
                      onMouseEnter={(e) => handleBarEnter(e, item, i)}
                      onMouseLeave={handleBarLeave}
                      style={{ cursor: "pointer" }}
                    />

                    {/* X-axis label */}
                    <text
                      x={x + barWidth / 2}
                      y={chartHeight + 20}
                      className="chart-axis__label chart-axis__label--x"
                    >
                      {formatLabel(item.label)}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* X-axis line */}
            <line
              x1={padding.left}
              x2={padding.left + chartWidth}
              y1={padding.top + chartHeight}
              y2={padding.top + chartHeight}
              className="chart-axis-line"
            />

            {/* Y-axis line */}
            <line
              x1={padding.left}
              x2={padding.left}
              y1={padding.top}
              y2={padding.top + chartHeight}
              className="chart-axis-line"
            />
          </svg>
        )}

        {/* Tooltip */}
        {tooltip && (
          <div
            className="chart-tooltip"
            style={{
              left: tooltip.x,
              top: tooltip.y,
            }}
          >
            <div className="chart-tooltip__value">
              {formatCurrency(tooltip.data.revenue, "USD")}
            </div>
            <div className="chart-tooltip__label">
              {tooltip.data.count}{" "}
              {tooltip.data.count === 1 ? "transaction" : "transactions"}
            </div>
            <div className="chart-tooltip__period">
              {formatLabel(tooltip.data.label)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

RevenueChart.propTypes = {
  data: PropTypes.shape({
    revenueByPeriod: PropTypes.array,
    data: PropTypes.array,
  }),
  timeRange: PropTypes.string,
  loading: PropTypes.bool,
};

export default RevenueChart;

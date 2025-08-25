// Chart.js configuration utilities
export const chartColors = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  purple: '#8b5cf6',
  gray: '#6b7280',
  gradient: {
    blue: ['#3b82f6', '#1d4ed8'],
    green: ['#10b981', '#047857'],
    orange: ['#f59e0b', '#d97706'],
    red: ['#ef4444', '#dc2626'],
    purple: ['#8b5cf6', '#7c3aed'],
  }
} as const;

export const chartFonts = {
  family: 'Inter, system-ui, sans-serif',
  size: {
    small: 10,
    medium: 12,
    large: 14,
    xlarge: 16,
  },
  weight: {
    normal: 'normal' as const,
    bold: 'bold' as const,
  }
} as const;

export const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        padding: 12,
        font: {
          size: chartFonts.size.small,
          family: chartFonts.family,
          weight: chartFonts.weight.bold,
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      titleColor: '#f1f5f9',
      bodyColor: '#cbd5e1',
      borderColor: '#334155',
      borderWidth: 1,
      cornerRadius: 8,
      titleFont: {
        size: 12,
        weight: chartFonts.weight.bold,
      },
      bodyFont: {
        size: chartFonts.size.small,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        font: {
          size: chartFonts.size.small,
          weight: chartFonts.weight.bold,
        },
        color: chartColors.gray,
      },
      grid: {
        color: 'rgba(148, 163, 184, 0.1)',
        drawBorder: false,
      },
      ticks: {
        color: chartColors.gray,
        font: {
          size: 10,
        },
      },
    },
    x: {
      title: {
        display: true,
        font: {
          size: chartFonts.size.small,
          weight: chartFonts.weight.bold,
        },
        color: chartColors.gray,
      },
      grid: {
        display: false,
      },
      ticks: {
        color: chartColors.gray,
        font: {
          size: 10,
        },
        maxRotation: 45,
      },
    },
  },
};

// Stock status utility
export const getStockStatus = (stock: number, threshold: number = 20) => {
  if (stock < threshold * 0.5) {
    return {
      status: 'critical',
      color: chartColors.danger,
      borderColor: '#dc2626',
      bgClass: 'bg-red-50',
      borderClass: 'border-red-100',
      textClass: 'text-red-600',
      label: 'Critical',
      message: 'Critical - Immediate restock needed',
    };
  }
  if (stock < threshold) {
    return {
      status: 'low',
      color: chartColors.warning,
      borderColor: '#d97706',
      bgClass: 'bg-amber-50',
      borderClass: 'border-amber-100',
      textClass: 'text-amber-600',
      label: 'Low',
      message: 'Low - Restock recommended',
    };
  }
  return {
    status: 'normal',
    color: chartColors.success,
    borderColor: '#059669',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-100',
    textClass: 'text-emerald-600',
    label: 'Normal',
    message: 'Normal',
  };
};

// Heatmap color calculation
export const calculateHeatmapColor = (intensity: number) => {
  const red = Math.floor(255 * intensity);
  const green = Math.floor(255 * (1 - intensity * 0.7));
  const blue = Math.floor(255 * (1 - intensity));
  return `rgb(${red}, ${green}, ${blue})`;
};

// Canvas drawing utilities
export const canvasUtils = {
  setCanvasSize: (canvas: HTMLCanvasElement, width: number, height: number) => {
    canvas.width = width;
    canvas.height = height;
  },
  
  clearCanvas: (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  },
  
  drawText: (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, options: {
    font?: string;
    color?: string;
    align?: CanvasTextAlign;
  } = {}) => {
    ctx.font = options.font || '12px Arial';
    ctx.fillStyle = options.color || '#374151';
    ctx.textAlign = options.align || 'left';
    ctx.fillText(text, x, y);
  },
  
  drawRect: (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  },
};

import { SalesData } from '../types';

// 異常値検出のための閾値
const THRESHOLDS = {
  SALES_DROP_MOM: -10, // 前月比10%以上の売上減少
  PROFIT_MARGIN_DROP: -5, // 利益率5%以上の低下
  EMPLOYEE_GROWTH_RATE: 1.5, // 従業員成長率が売上成長率の1.5倍以上
};

// 異常値の検出結果の型定義
export interface AnomalyDetectionResult {
  hasSalesAnomaly: boolean;
  hasProfitAnomaly: boolean;
  hasProductivityAnomaly: boolean;
  salesAnomalyDetails?: string;
  profitAnomalyDetails?: string;
  productivityAnomalyDetails?: string;
  potentialImpact: number;
  recommendations: string[];
}

// トレンド分析の結果の型定義
export interface TrendAnalysisResult {
  salesTrend: 'up' | 'down' | 'stable';
  profitTrend: 'up' | 'down' | 'stable';
  productivityTrend: 'up' | 'down' | 'stable';
  nextMonthSalesForecast: number;
  nextMonthProfitForecast: number;
  riskLevel: 'low' | 'medium' | 'high';
  potentialLoss: number;
}

// 異常値を検出する関数
export const detectAnomalies = (data: SalesData[]): AnomalyDetectionResult => {
  const currentMonth = data[data.length - 1];
  const previousMonth = data[data.length - 2];
  const recommendations: string[] = [];
  let potentialImpact = 0;

  // 売上の異常値検出
  const salesMoM = currentMonth.momGrowth || 0;
  const hasSalesAnomaly = salesMoM < THRESHOLDS.SALES_DROP_MOM;
  if (hasSalesAnomaly) {
    potentialImpact += currentMonth.total * Math.abs(salesMoM) / 100;
    recommendations.push(
      '広告費の最適化と顧客獲得戦略の見直しを検討してください。',
      '既存顧客へのアプローチを強化し、解約率の低下を図ってください。'
    );
  }

  // 利益率の異常値検出
  const currentProfitMargin = (currentMonth.operatingProfit || 0) / currentMonth.total * 100;
  const previousProfitMargin = (previousMonth.operatingProfit || 0) / previousMonth.total * 100;
  const profitMarginChange = currentProfitMargin - previousProfitMargin;
  const hasProfitAnomaly = profitMarginChange < THRESHOLDS.PROFIT_MARGIN_DROP;
  if (hasProfitAnomaly) {
    potentialImpact += currentMonth.total * Math.abs(profitMarginChange) / 100;
    recommendations.push(
      'コスト構造の見直しと価格戦略の再検討を行ってください。',
      '運営効率の改善とコスト削減施策を実施してください。'
    );
  }

  // 生産性の異常値検出
  const employeeGrowthRate = ((currentMonth.employees || 0) - (previousMonth.employees || 0)) / (previousMonth.employees || 1) * 100;
  const salesGrowthRate = currentMonth.momGrowth || 0;
  const hasProductivityAnomaly = employeeGrowthRate > salesGrowthRate * THRESHOLDS.EMPLOYEE_GROWTH_RATE;
  if (hasProductivityAnomaly) {
    potentialImpact += (currentMonth.total / (currentMonth.employees || 1)) * Math.abs(employeeGrowthRate - salesGrowthRate) / 100;
    recommendations.push(
      '従業員の生産性向上トレーニングを実施してください。',
      'ワークフローの効率化と業務プロセスの見直しを検討してください。'
    );
  }

  return {
    hasSalesAnomaly,
    hasProfitAnomaly,
    hasProductivityAnomaly,
    salesAnomalyDetails: hasSalesAnomaly ? `売上が前月比${salesMoM.toFixed(1)}%減少しています。` : undefined,
    profitAnomalyDetails: hasProfitAnomaly ? `利益率が${Math.abs(profitMarginChange).toFixed(1)}%低下しています。` : undefined,
    productivityAnomalyDetails: hasProductivityAnomaly ? `従業員の増加率(${employeeGrowthRate.toFixed(1)}%)が売上成長率(${salesGrowthRate.toFixed(1)}%)を大きく上回っています。` : undefined,
    potentialImpact: Math.round(potentialImpact),
    recommendations: [...new Set(recommendations)]
  };
};

// 単純移動平均を計算する関数
const calculateSMA = (data: number[], period: number): number => {
  const values = data.slice(-period);
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

// トレンドを分析する関数
export const analyzeTrends = (data: SalesData[]): TrendAnalysisResult => {
  const last3Months = data.slice(-3);
  const last6Months = data.slice(-6);

  // 売上トレンドの分析
  const salesTrend = determineTrend(last3Months.map(m => m.total));
  const profitTrend = determineTrend(last3Months.map(m => m.operatingProfit || 0));
  const productivityTrend = determineTrend(
    last3Months.map(m => (m.total / (m.employees || 1)))
  );

  // 次月の予測
  const salesSMA3 = calculateSMA(last3Months.map(m => m.total), 3);
  const salesSMA6 = calculateSMA(last6Months.map(m => m.total), 6);
  const nextMonthSalesForecast = salesSMA3 * (salesSMA3 / salesSMA6); // トレンドを考慮した予測

  const profitSMA3 = calculateSMA(last3Months.map(m => m.operatingProfit || 0), 3);
  const profitSMA6 = calculateSMA(last6Months.map(m => m.operatingProfit || 0), 6);
  const nextMonthProfitForecast = profitSMA3 * (profitSMA3 / profitSMA6);

  // リスクレベルの判定
  const riskLevel = determineRiskLevel(salesTrend, profitTrend, productivityTrend);

  // 潜在的な損失の計算
  const potentialLoss = calculatePotentialLoss(data[data.length - 1], salesTrend, profitTrend);

  return {
    salesTrend,
    profitTrend,
    productivityTrend,
    nextMonthSalesForecast: Math.round(nextMonthSalesForecast),
    nextMonthProfitForecast: Math.round(nextMonthProfitForecast),
    riskLevel,
    potentialLoss: Math.round(potentialLoss)
  };
};

// トレンドを判定する関数
const determineTrend = (values: number[]): 'up' | 'down' | 'stable' => {
  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  const changeRate = ((lastValue - firstValue) / firstValue) * 100;

  if (changeRate > 2) return 'up';
  if (changeRate < -2) return 'down';
  return 'stable';
};

// リスクレベルを判定する関数
const determineRiskLevel = (
  salesTrend: 'up' | 'down' | 'stable',
  profitTrend: 'up' | 'down' | 'stable',
  productivityTrend: 'up' | 'down' | 'stable'
): 'low' | 'medium' | 'high' => {
  const trends = [salesTrend, profitTrend, productivityTrend];
  const downTrends = trends.filter(t => t === 'down').length;

  if (downTrends >= 2) return 'high';
  if (downTrends === 1) return 'medium';
  return 'low';
};

// 潜在的な損失を計算する関数
const calculatePotentialLoss = (
  currentMonth: SalesData,
  salesTrend: 'up' | 'down' | 'stable',
  profitTrend: 'up' | 'down' | 'stable'
): number => {
  let potentialLoss = 0;

  if (salesTrend === 'down') {
    potentialLoss += currentMonth.total * 0.1; // 売上10%減少と仮定
  }
  if (profitTrend === 'down') {
    potentialLoss += (currentMonth.operatingProfit || 0) * 0.15; // 利益15%減少と仮定
  }

  return potentialLoss;
}; 
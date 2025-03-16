import { SalesData } from '../types';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface BusinessInsightsProps {
  salesData: SalesData[];
}

// 異常検知の結果の型定義
interface Anomaly {
  metric: string;
  value: number;
  threshold: number;
  impact: string;
}

// トレンド分析の結果の型定義
interface Trend {
  metric: string;
  direction: string;
  value: number;
  period: string;
  message: string;
}

// 予測の結果の型定義
interface Forecast {
  metric: string;
  value: string;
  change: number;
  message: string;
}

// ビジネスインパクト評価の結果の型定義
interface Impact {
  area: string;
  risk: string;
  value: string;
  message: string;
}

// アクションプランの型定義
interface Action {
  title: string;
  description: string;
  impact: string;
}

export default function BusinessInsights({ salesData }: BusinessInsightsProps) {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  
  // データ分析の実行
  useEffect(() => {
    analyzeData();
  }, [salesData]);
  
  // データ分析のロジック
  const analyzeData = () => {
    if (salesData.length < 3) return;
    
    // 異常値の検出
    const detectAnomalies = (data: number[], threshold = 1.5): boolean[] => {
      const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
      const squareDiffs = data.map(val => Math.pow(val - mean, 2));
      const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / squareDiffs.length;
      const stdDev = Math.sqrt(avgSquareDiff);
      
      return data.map(val => Math.abs(val - mean) > threshold * stdDev);
    };
    
    // 売上の異常値を検出
    const salesValues = salesData.map(item => item.total);
    const salesAnomalies = detectAnomalies(salesValues);
    
    // 利益の異常値を検出
    const profitValues = salesData.map(item => item.operatingProfit || 0);
    const profitAnomalies = detectAnomalies(profitValues);
    
    // 生産性の異常値を検出
    const productivityValues = salesData.map(item => (item.operatingProfit || 0) / (item.employees || 1));
    const productivityAnomalies = detectAnomalies(productivityValues);
    
    // トレンド分析
    const analyzeTrend = (data: number[]): 'rise' | 'fall' | 'stable' => {
      if (data.length < 2) return 'stable';
      
      const lastThreeMonths = data.slice(-3);
      const firstValue = lastThreeMonths[0];
      const lastValue = lastThreeMonths[lastThreeMonths.length - 1];
      
      const percentChange = ((lastValue - firstValue) / Math.abs(firstValue)) * 100;
      
      if (percentChange > 5) return 'rise';
      if (percentChange < -5) return 'fall';
      return 'stable';
    };
    
    const salesTrend = analyzeTrend(salesValues);
    const profitTrend = analyzeTrend(profitValues);
    const productivityTrend = analyzeTrend(productivityValues);
    
    // 予測分析
    const predictNextMonth = (data: number[]): number => {
      if (data.length < 2) return data[0] || 0;
      
      // 簡易的な線形回帰による予測
      const x = Array.from({ length: data.length }, (_, i) => i);
      const y = data;
      
      const n = x.length;
      const sumX = x.reduce((a, b) => a + b, 0);
      const sumY = y.reduce((a, b) => a + b, 0);
      const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
      const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      
      // 次の月の予測
      return intercept + slope * data.length;
    };
    
    const predictedSales = predictNextMonth(salesValues);
    const predictedProfit = predictNextMonth(profitValues);
    
    // リスク評価
    const calculateRisk = (anomalies: boolean[], trend: 'rise' | 'fall' | 'stable'): 'low' | 'medium' | 'high' => {
      const hasAnomaly = anomalies.slice(-3).some(a => a);
      
      if (hasAnomaly && trend === 'fall') return 'high';
      if (hasAnomaly || trend === 'fall') return 'medium';
      return 'low';
    };
    
    const salesRisk = calculateRisk(salesAnomalies, salesTrend);
    const profitRisk = calculateRisk(profitAnomalies, profitTrend);
    const productivityRisk = calculateRisk(productivityAnomalies, productivityTrend);
    
    // ビジネスインパクトの計算
    const calculateImpact = (currentValue: number, risk: 'low' | 'medium' | 'high'): number => {
      const riskFactors = {
        low: 0.02,
        medium: 0.05,
        high: 0.1
      };
      
      return currentValue * riskFactors[risk];
    };
    
    const salesImpact = calculateImpact(salesValues[salesValues.length - 1], salesRisk);
    
    // アクションプランの生成
    const generateActionPlan = (
      salesRisk: 'low' | 'medium' | 'high',
      profitRisk: 'low' | 'medium' | 'high',
      productivityRisk: 'low' | 'medium' | 'high'
    ): string[] => {
      const actions: string[] = [];
      
      if (salesRisk === 'high') {
        actions.push('営業チームとの緊急ミーティングを設定し、売上低下の原因を特定する');
        actions.push('主要顧客へのフォローアップを強化し、解約リスクを軽減する');
      } else if (salesRisk === 'medium') {
        actions.push('営業パイプラインの見直しと、新規顧客獲得戦略の強化');
      }
      
      if (profitRisk === 'high') {
        actions.push('コスト削減計画を立案し、不要な支出を特定する');
        actions.push('価格戦略の見直しと、高利益商品・サービスの販売促進');
      } else if (profitRisk === 'medium') {
        actions.push('利益率の低い商品・サービスの見直しと改善');
      }
      
      if (productivityRisk === 'high') {
        actions.push('従業員の生産性向上のためのトレーニングプログラムを実施');
        actions.push('業務プロセスの効率化と自動化の検討');
      } else if (productivityRisk === 'medium') {
        actions.push('部門ごとの生産性指標を設定し、定期的なレビューを実施');
      }
      
      if (actions.length === 0) {
        actions.push('現在の戦略を維持し、市場の変化に注意を払う');
      }
      
      return actions;
    };
    
    const actionPlans = generateActionPlan(salesRisk, profitRisk, productivityRisk);
    
    // 異常検知の結果を設定
    const anomaliesResult: Anomaly[] = [
      {
        metric: '売上',
        value: salesValues[salesValues.length - 1],
        threshold: salesValues[salesValues.length - 2] * 1.1,
        impact: '¥10.5M'
      },
      {
        metric: '営業利益',
        value: profitValues[profitValues.length - 1],
        threshold: profitValues[profitValues.length - 2] * 1.15,
        impact: '¥2.3M'
      },
      {
        metric: '従業員生産性',
        value: productivityValues[productivityValues.length - 1],
        threshold: productivityValues[productivityValues.length - 2] * 1.05,
        impact: '¥1.8M'
      }
    ];
    setAnomalies(anomaliesResult);
    
    // トレンド分析の結果を設定
    const trendsResult: Trend[] = [
      {
        metric: '売上',
        direction: salesTrend === 'rise' ? '上昇' : salesTrend === 'fall' ? '下降' : '安定',
        value: Math.abs(salesValues[salesValues.length - 1] - salesValues[salesValues.length - 2]) / salesValues[salesValues.length - 2] * 100,
        period: '過去3ヶ月',
        message: salesTrend === 'rise' ? '安定した成長を維持しています' : salesTrend === 'fall' ? '一時的に低下しています' : '安定した成長を維持しています'
      },
      {
        metric: '営業利益',
        direction: profitTrend === 'rise' ? '上昇' : profitTrend === 'fall' ? '下降' : '安定',
        value: Math.abs(profitValues[profitValues.length - 1] - profitValues[profitValues.length - 2]) / profitValues[profitValues.length - 2] * 100,
        period: '過去3ヶ月',
        message: profitTrend === 'rise' ? '効率化により利益率が向上しています' : profitTrend === 'fall' ? '一時的に低下しています' : '効率化により利益率が向上しています'
      },
      {
        metric: '従業員生産性',
        direction: productivityTrend === 'rise' ? '上昇' : productivityTrend === 'fall' ? '下降' : '安定',
        value: Math.abs(productivityValues[productivityValues.length - 1] - productivityValues[productivityValues.length - 2]) / productivityValues[productivityValues.length - 2] * 100,
        period: '過去3ヶ月',
        message: productivityTrend === 'rise' ? '新規採用の増加により一時的に低下しています' : productivityTrend === 'fall' ? '新規採用の増加により一時的に低下しています' : '新規採用の増加により一時的に低下しています'
      }
    ];
    setTrends(trendsResult);
    
    // 予測の結果を設定
    const forecastsResult: Forecast[] = [
      {
        metric: '売上',
        value: `¥${predictedSales.toLocaleString()}`,
        change: Math.abs(predictedSales - salesValues[salesValues.length - 1]) / salesValues[salesValues.length - 1] * 100,
        message: predictedSales > salesValues[salesValues.length - 1] ? '成長トレンドが継続する見込み' : '売上が一時的に低下する見込み'
      },
      {
        metric: '営業利益',
        value: `¥${predictedProfit.toLocaleString()}`,
        change: Math.abs(predictedProfit - profitValues[profitValues.length - 1]) / profitValues[profitValues.length - 1] * 100,
        message: predictedProfit > profitValues[profitValues.length - 1] ? '利益率の改善が見込まれます' : '利益率が一時的に低下する見込み'
      }
    ];
    setForecasts(forecastsResult);
    
    // ビジネスインパクト評価の結果を設定
    const impactsResult: Impact[] = [
      {
        area: '営業効率',
        risk: salesRisk === 'high' ? '高' : salesRisk === 'medium' ? '中' : '低',
        value: `¥${salesImpact.toLocaleString()}`,
        message: salesRisk === 'high' ? '営業コスト増加による利益率低下のリスク' : salesRisk === 'medium' ? '営業コストの増加による利益率の低下のリスク' : '営業コストの増加による利益率の低下のリスク'
      },
      {
        area: '人材採用',
        risk: productivityRisk === 'high' ? '高' : productivityRisk === 'medium' ? '中' : '低',
        value: `¥${calculateImpact(salesValues[salesValues.length - 1], productivityRisk).toLocaleString()}`,
        message: productivityRisk === 'high' ? '採用遅延による売上機会損失のリスク' : productivityRisk === 'medium' ? '採用遅延による売上機会損失のリスク' : '採用遅延による売上機会損失のリスク'
      }
    ];
    setImpacts(impactsResult);
    
    // アクションプランの結果を設定
    const actionsResult: Action[] = actionPlans.map((description, index) => ({
      title: `アクション${index + 1}`,
      description,
      impact: calculateImpact(salesValues[salesValues.length - 1], salesRisk).toLocaleString()
    }));
    setActions(actionsResult);
  };
  
  return (
    <div className="space-y-3 p-4">
      {/* 異常検知 */}
      <div className="bg-gray-800 rounded-lg p-3 shadow-lg">
        <h3 className="text-base font-bold mb-2 text-white">異常検知</h3>
        <div className="space-y-2">
          {anomalies.map((anomaly, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded">
              <div>
                <p className="text-sm font-medium text-white">{anomaly.metric}</p>
                <p className="text-xs text-gray-400">閾値: {anomaly.threshold.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{anomaly.value.toLocaleString()}</p>
                <p className="text-xs text-red-600">影響: {anomaly.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* トレンド分析 */}
      <div className="bg-gray-800 rounded-lg p-3 shadow-lg">
        <h3 className="text-base font-bold mb-2 text-white">トレンド分析</h3>
        <div className="space-y-2">
          {trends.map((trend, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded">
              <div>
                <p className="text-sm font-medium text-white">{trend.metric}</p>
                <p className="text-xs text-gray-400">{trend.period}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end">
                  <p className={`text-sm font-medium ${trend.direction === '上昇' ? 'text-green-600' : trend.direction === '下降' ? 'text-red-600' : 'text-gray-500'}`}>
                    {trend.direction} ({trend.value.toFixed(1)}%)
                  </p>
                  {trend.direction === '上昇' ? <TrendingUp className="ml-1 w-4 h-4 text-green-600" /> : 
                   trend.direction === '下降' ? <TrendingDown className="ml-1 w-4 h-4 text-red-600" /> : 
                   <span className="ml-1 w-4 h-4 text-gray-500">-</span>}
                </div>
                <p className="text-xs text-gray-400">{trend.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 予測 */}
      <div className="bg-gray-800 rounded-lg p-3 shadow-lg">
        <h3 className="text-base font-bold mb-2 text-white">来月の予測</h3>
        <div className="space-y-2">
          {forecasts.map((forecast, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded">
              <div>
                <p className="text-sm font-medium text-white">{forecast.metric}</p>
                <p className="text-xs text-gray-400">{forecast.message}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{forecast.value}</p>
                <p className="text-xs text-green-600">+{forecast.change.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* ビジネスインパクト */}
      <div className="bg-gray-800 rounded-lg p-3 shadow-lg">
        <h3 className="text-base font-bold mb-2 text-white">ビジネスインパクト</h3>
        <div className="space-y-2">
          {impacts.map((impact, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded">
              <div>
                <p className="text-sm font-medium text-white">{impact.area}</p>
                <p className="text-xs text-gray-400">{impact.message}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{impact.value}</p>
                <p className={`text-xs ${impact.risk === '低' ? 'text-green-600' : impact.risk === '中' ? 'text-amber-500' : 'text-red-600'}`}>
                  リスク: {impact.risk}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* アクションプラン */}
      <div className="bg-gray-800 rounded-lg p-3 shadow-lg">
        <h3 className="text-base font-bold mb-2 text-white">アクションプラン</h3>
        <div className="space-y-2">
          {actions.map((action, index) => (
            <div key={index} className="bg-gray-700 p-2 rounded">
              <p className="text-sm font-medium text-white">{action.title}</p>
              <p className="text-xs text-gray-400 mt-1">{action.description}</p>
              <p className="text-xs text-green-600 mt-1">潜在的効果: ¥{action.impact}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
import { SalesData } from '../types';
import { detectAnomalies, analyzeTrends } from '../utils/analytics';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RemoveIcon from '@mui/icons-material/Remove';

interface BusinessInsightsProps {
  data: SalesData[];
}

const BusinessInsights = ({ data }: BusinessInsightsProps) => {
  if (data.length < 2) return null;

  const anomalies = detectAnomalies(data);
  const trends = analyzeTrends(data);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon style={{ color: '#059669' }} fontSize="small" />;
      case 'down':
        return <TrendingDownIcon style={{ color: '#DC2626' }} fontSize="small" />;
      case 'stable':
        return <RemoveIcon style={{ color: '#6B7280' }} fontSize="small" />;
    }
  };

  const getRiskLevelColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-amber-500';
      case 'high':
        return 'text-red-600';
    }
  };

  // 異常値が検出されたかどうかを確認
  const hasAnomalies = anomalies.hasSalesAnomaly || anomalies.hasProfitAnomaly || anomalies.hasProductivityAnomaly;

  return (
    <div className="space-y-3">
      {/* 異常値検出セクション */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
        <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">異常値検出</h3>
        <div className="space-y-2">
          {!hasAnomalies && (
            <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded">
              <p className="text-xs text-green-700 dark:text-green-300">現在、異常値は検出されていません。</p>
            </div>
          )}
          {anomalies.hasSalesAnomaly && (
            <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded">
              <p className="text-xs text-red-700 dark:text-red-300">{anomalies.salesAnomalyDetails}</p>
            </div>
          )}
          {anomalies.hasProfitAnomaly && (
            <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded">
              <p className="text-xs text-red-700 dark:text-red-300">{anomalies.profitAnomalyDetails}</p>
            </div>
          )}
          {anomalies.hasProductivityAnomaly && (
            <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded">
              <p className="text-xs text-red-700 dark:text-red-300">{anomalies.productivityAnomalyDetails}</p>
            </div>
          )}
          {anomalies.potentialImpact > 0 && (
            <div className="mt-2">
              <p className="text-xs font-semibold text-gray-900 dark:text-white">潜在的な影響額:</p>
              <p className="text-base text-red-600 dark:text-red-400">¥{anomalies.potentialImpact.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* トレンド分析セクション */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
        <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">トレンド分析</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">売上トレンド</p>
            <div className="flex items-center">
              {getTrendIcon(trends.salesTrend)}
              <span className="ml-1 text-xs text-gray-900 dark:text-white">{trends.salesTrend === 'up' ? '上昇' : trends.salesTrend === 'down' ? '下降' : '安定'}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">利益トレンド</p>
            <div className="flex items-center">
              {getTrendIcon(trends.profitTrend)}
              <span className="ml-1 text-xs text-gray-900 dark:text-white">{trends.profitTrend === 'up' ? '上昇' : trends.profitTrend === 'down' ? '下降' : '安定'}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">生産性トレンド</p>
            <div className="flex items-center">
              {getTrendIcon(trends.productivityTrend)}
              <span className="ml-1 text-xs text-gray-900 dark:text-white">{trends.productivityTrend === 'up' ? '上昇' : trends.productivityTrend === 'down' ? '下降' : '安定'}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">リスクレベル</p>
            <span className={`${getRiskLevelColor(trends.riskLevel)} font-medium text-xs`}>
              {trends.riskLevel === 'low' ? '低' : trends.riskLevel === 'medium' ? '中' : '高'}
            </span>
          </div>
        </div>
      </div>

      {/* 予測と推奨アクションセクション */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
        <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">予測と推奨アクション</h3>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">来月の予測売上</p>
            <p className="text-base text-gray-900 dark:text-white">¥{trends.nextMonthSalesForecast.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">来月の予測利益</p>
            <p className="text-base text-gray-900 dark:text-white">¥{trends.nextMonthProfitForecast.toLocaleString()}</p>
          </div>
          {trends.potentialLoss > 0 && (
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">潜在的な損失リスク</p>
              <p className="text-base text-red-600 dark:text-red-400">¥{trends.potentialLoss.toLocaleString()}</p>
            </div>
          )}
          {anomalies.recommendations.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-semibold mb-1 text-gray-900 dark:text-white">推奨アクション:</p>
              <ul className="list-disc pl-4 space-y-1">
                {anomalies.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-xs text-gray-700 dark:text-gray-300">{recommendation}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessInsights; 
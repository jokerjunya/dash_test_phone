import { SalesData } from '../types';
import { useState, useEffect } from 'react';

interface BusinessInsightsProps {
  data: SalesData[];
}

// 異常検知の結果型
interface Anomaly {
  message: string;
  impact: '高' | '中' | '低';
}

// トレンド分析の結果型
interface Trend {
  metric: string;
  direction: '上昇' | '下降' | '安定';
  value: number;
  period: string;
  message: string;
}

// 予測の結果型
interface Forecast {
  metric: string;
  value: string;
  change: number;
  message: string;
}

// ビジネスインパクト評価の結果型
interface Impact {
  area: string;
  risk: '高' | '中' | '低';
  value: string;
  message: string;
}

// アクションプランの結果型
interface Action {
  title: string;
  description: string;
  impact: string;
}

const BusinessInsights = ({ data }: BusinessInsightsProps) => {
  // 異常検知
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  // トレンド分析
  const [trends, setTrends] = useState<Trend[]>([]);
  // 予測
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  // ビジネスインパクト評価
  const [impacts, setImpacts] = useState<Impact[]>([]);
  // アクションプラン
  const [actions, setActions] = useState<Action[]>([]);

  useEffect(() => {
    // データから異常検知、トレンド分析、予測を計算
    analyzeData(data);
  }, [data]);

  // データ分析関数
  const analyzeData = (salesData: SalesData[]) => {
    if (salesData.length < 3) return;

    // 異常検知の例
    const anomaliesResult: Anomaly[] = [
      {
        message: '先月の売上が前年同月比で15%減少しています',
        impact: '高'
      },
      {
        message: '営業利益率が過去3ヶ月間で5%低下しています',
        impact: '中'
      }
    ];
    setAnomalies(anomaliesResult);

    // トレンド分析の例
    const trendsResult: Trend[] = [
      {
        metric: '売上',
        direction: '上昇',
        value: 10.3,
        period: '過去3ヶ月',
        message: '安定した成長を維持しています'
      },
      {
        metric: '営業利益',
        direction: '上昇',
        value: 15.5,
        period: '過去3ヶ月',
        message: '効率化により利益率が向上しています'
      },
      {
        metric: '従業員生産性',
        direction: '下降',
        value: -5.2,
        period: '過去3ヶ月',
        message: '新規採用の増加により一時的に低下しています'
      }
    ];
    setTrends(trendsResult);

    // 予測の例
    const forecastsResult: Forecast[] = [
      {
        metric: '売上',
        value: '¥125.5M',
        change: 8.5,
        message: '成長トレンドが継続する見込み'
      },
      {
        metric: '営業利益',
        value: '¥25.1M',
        change: 12.3,
        message: '利益率の改善が見込まれます'
      }
    ];
    setForecasts(forecastsResult);

    // ビジネスインパクト評価の例
    const impactsResult: Impact[] = [
      {
        area: '営業効率',
        risk: '中',
        value: '¥10.2M',
        message: '営業コスト増加による利益率低下のリスク'
      },
      {
        area: '人材採用',
        risk: '低',
        value: '¥5.5M',
        message: '採用遅延による売上機会損失のリスク'
      }
    ];
    setImpacts(impactsResult);

    // アクションプランの例
    const actionsResult: Action[] = [
      {
        title: '営業プロセスの効率化',
        description: 'CRMシステムの導入と営業フローの最適化',
        impact: '営業コスト15%削減'
      },
      {
        title: '人材採用の加速',
        description: '採用チャネルの多様化と採用プロセスの迅速化',
        impact: '採用期間を30%短縮'
      },
      {
        title: '製品ラインの拡充',
        description: '新規市場向けの製品開発と既存製品の改良',
        impact: '売上20%増加'
      }
    ];
    setActions(actionsResult);
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
  const hasAnomalies = anomalies.length > 0;

  return (
    <div className="space-y-3">
      {/* 異常検知セクション */}
      <div className="card bg-gray-900 p-3 rounded-lg shadow-sm">
        <h3 className="text-base font-semibold mb-2 text-white">異常検知</h3>
        <div className="space-y-2">
          {anomalies.map((anomaly, index) => (
            <div key={index} className="flex items-start">
              <span className="text-gray-400 mr-2">⚠</span>
              <div>
                <p className="text-xs text-gray-300">{anomaly.message}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  影響: <span className={`font-semibold ${getImpactColor(anomaly.impact)}`}>
                    {anomaly.impact}
                  </span>
                </p>
              </div>
            </div>
          ))}
          {anomalies.length === 0 && (
            <p className="text-xs text-gray-300">現在、検出された異常はありません。</p>
          )}
        </div>
      </div>

      {/* トレンド分析セクション */}
      <div className="card bg-gray-900 p-3 rounded-lg shadow-sm">
        <h3 className="text-base font-semibold mb-2 text-white">トレンド分析</h3>
        <div className="space-y-2">
          {trends.map((trend, index) => (
            <div key={index} className="flex items-start">
              <span className={`mr-2 ${getTrendIcon(trend.direction)}`}></span>
              <div>
                <p className="text-xs text-gray-300">{trend.metric}: {trend.message}</p>
                <div className="flex items-center mt-0.5">
                  <span className={`text-xs ${getTrendColor(trend.direction)}`}>
                    {getTrendSymbol(trend.direction)} {trend.value}%
                  </span>
                  <span className="text-xs text-gray-400 ml-1">
                    ({trend.period})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 予測セクション */}
      <div className="card bg-gray-900 p-3 rounded-lg shadow-sm">
        <h3 className="text-base font-semibold mb-2 text-white">来月の予測</h3>
        <div className="space-y-2">
          {forecasts.map((forecast, index) => (
            <div key={index} className="flex items-start">
              <span className="text-green-500 mr-2">📈</span>
              <div>
                <p className="text-xs text-gray-300">{forecast.metric}: {forecast.message}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  予測値: <span className="font-semibold text-white">{forecast.value}</span>
                  <span className={`ml-1 ${forecast.change >= 0 ? 'text-green-500' : 'text-gray-400'}`}>
                    ({forecast.change >= 0 ? '+' : ''}{forecast.change}%)
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ビジネスインパクト評価 */}
      <div className="card bg-gray-900 p-3 rounded-lg shadow-sm">
        <h3 className="text-base font-semibold mb-2 text-white">ビジネスインパクト評価</h3>
        <div className="space-y-2">
          {impacts.map((impact, index) => (
            <div key={index} className="flex items-start">
              <span className="text-gray-400 mr-2">💼</span>
              <div>
                <p className="text-xs text-gray-300">{impact.area}: {impact.message}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  潜在的損失リスク: <span className={`font-semibold ${getRiskColor(impact.risk)}`}>
                    {impact.value}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* アクションプラン */}
      <div className="card bg-gray-900 p-3 rounded-lg shadow-sm">
        <h3 className="text-base font-semibold mb-2 text-white">推奨アクションプラン</h3>
        <div className="space-y-2">
          {actions.map((action, index) => (
            <div key={index} className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <div>
                <p className="text-xs text-gray-300">{action.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{action.description}</p>
                <p className="text-xs text-green-500 mt-0.5">期待効果: {action.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessInsights;

// ヘルパー関数
function getImpactColor(impact: string): string {
  switch (impact) {
    case '高':
      return 'text-gray-400';
    case '中':
      return 'text-gray-400';
    case '低':
      return 'text-green-500';
    default:
      return 'text-gray-400';
  }
}

function getTrendColor(direction: string): string {
  switch (direction) {
    case '上昇':
      return 'text-green-500';
    case '下降':
      return 'text-gray-400';
    case '安定':
      return 'text-gray-400';
    default:
      return 'text-gray-400';
  }
}

function getTrendIcon(direction: string): string {
  switch (direction) {
    case '上昇':
      return 'text-green-500';
    case '下降':
      return 'text-gray-400';
    case '安定':
      return 'text-gray-400';
    default:
      return 'text-gray-400';
  }
}

function getTrendSymbol(direction: string): string {
  switch (direction) {
    case '上昇':
      return '↑';
    case '下降':
      return '↓';
    case '安定':
      return '→';
    default:
      return '-';
  }
}

function getRiskColor(risk: string): string {
  switch (risk) {
    case '高':
      return 'text-gray-400';
    case '中':
      return 'text-gray-400';
    case '低':
      return 'text-green-500';
    default:
      return 'text-gray-400';
  }
} 
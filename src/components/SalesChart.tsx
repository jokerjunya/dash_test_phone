import { SalesData } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
  ComposedChart
} from 'recharts';
import { useState } from 'react';

interface SalesChartProps {
  data: SalesData[];
}

const SalesChart = ({ data }: SalesChartProps) => {
  // 前年比の平均を計算
  const avgYoYGrowth = data.reduce((sum, item) => sum + (item.yoyGrowth || 0), 0) / data.length;
  const [chartType, setChartType] = useState<'combined' | 'bar' | 'line'>('combined');

  // モバイル向けに月名を短縮
  const formattedData = data.map(item => ({
    ...item,
    month: item.month.replace('月', '') // "1月" → "1"
  }));

  // 最新の6ヶ月分のデータのみ表示（モバイル向け）
  const recentData = formattedData.slice(-6);

  return (
    <div className="card">
      <h3 className="section-title">月次売上推移</h3>
      
      {/* チャートタイプ切り替えボタン */}
      <div className="flex justify-center mb-4 text-sm">
        <button 
          onClick={() => setChartType('combined')} 
          className={`px-3 py-1 rounded-l-md ${chartType === 'combined' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        >
          複合
        </button>
        <button 
          onClick={() => setChartType('bar')} 
          className={`px-3 py-1 ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        >
          棒グラフ
        </button>
        <button 
          onClick={() => setChartType('line')} 
          className={`px-3 py-1 rounded-r-md ${chartType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        >
          折線
        </button>
      </div>
      
      <div className="h-64">
        {chartType === 'combined' && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={recentData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis 
                yAxisId="left" 
                orientation="left"
                tickFormatter={(value) => `${value / 1000000}M`}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                domain={[0, Math.max(...recentData.map(d => d.yoyGrowth || 0)) * 1.2]}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'yoyGrowth') {
                    return [`${value}%`, '前年同月比'];
                  }
                  return [value, name === 'total' ? '合計' : name];
                }}
                labelFormatter={(label) => `${label}月`}
              />
              <Legend 
                formatter={(value) => {
                  return value === 'total' ? '合計' : 
                         value === 'yoyGrowth' ? '前年比' : value;
                }}
                wrapperStyle={{ fontSize: '10px' }}
              />
              <Bar yAxisId="left" dataKey="total" fill="#8884d8" name="total" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="yoyGrowth"
                stroke="#ff7300"
                name="yoyGrowth"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
        
        {chartType === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={recentData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
              <Tooltip 
                formatter={(value, name) => {
                  return [value, name === 'unitA' ? '事業部A' : name === 'unitB' ? '事業部B' : name === 'unitC' ? '事業部C' : '合計'];
                }}
                labelFormatter={(label) => `${label}月`}
              />
              <Legend 
                formatter={(value) => {
                  return value === 'unitA' ? '事業部A' : 
                         value === 'unitB' ? '事業部B' : 
                         value === 'unitC' ? '事業部C' : value;
                }}
                wrapperStyle={{ fontSize: '10px' }}
              />
              <Bar dataKey="unitA" stackId="a" fill="#8884d8" />
              <Bar dataKey="unitB" stackId="a" fill="#82ca9d" />
              <Bar dataKey="unitC" stackId="a" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        )}
        
        {chartType === 'line' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={recentData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'yoyGrowth' || name === 'momGrowth') {
                    return [`${value}%`, name === 'yoyGrowth' ? '前年同月比' : '前月比'];
                  }
                  return [value, name === 'total' ? '合計' : name];
                }}
                labelFormatter={(label) => `${label}月`}
              />
              <Legend 
                formatter={(value) => {
                  return value === 'total' ? '合計' : 
                         value === 'yoyGrowth' ? '前年比' : 
                         value === 'momGrowth' ? '前月比' : value;
                }}
                wrapperStyle={{ fontSize: '10px' }}
              />
              <Line type="monotone" dataKey="total" stroke="#8884d8" />
              <Line type="monotone" dataKey="yoyGrowth" stroke="#ff7300" />
              <Line type="monotone" dataKey="momGrowth" stroke="#82ca9d" strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      
      <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
        <p className="font-medium">前年比分析:</p>
        <p>
          平均成長率: <span className="font-semibold text-orange-500">{avgYoYGrowth.toFixed(1)}%</span> | 
          最高成長月: <span className="font-semibold text-green-500">
            {data.reduce((max, item) => Math.max(max, item.yoyGrowth || 0), 0).toFixed(1)}%
          </span>
        </p>
      </div>
    </div>
  );
};

export default SalesChart; 
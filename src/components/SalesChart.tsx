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
  const [chartType, setChartType] = useState<'combined' | 'bar' | 'line' | 'profit'>('combined');

  // モバイル向けに月名を短縮
  const formattedData = data.map(item => ({
    ...item,
    month: item.month.replace('月', '') // "1月" → "1"
  }));

  // 最新の6ヶ月分のデータのみ表示（モバイル向け）
  const recentData = formattedData.slice(-6);

  // 営業利益率と純利益率の計算
  const totalSales = data.reduce((sum, item) => sum + item.total, 0);
  const totalOperatingProfit = data.reduce((sum, item) => sum + (item.operatingProfit || 0), 0);
  const totalNetProfit = data.reduce((sum, item) => sum + (item.netProfit || 0), 0);
  
  const operatingProfitMargin = (totalOperatingProfit / totalSales) * 100;
  const netProfitMargin = (totalNetProfit / totalSales) * 100;

  return (
    <div className="card overflow-hidden p-2 md:p-4">
      <h3 className="section-title text-xs md:text-base mb-1">月次売上推移</h3>
      
      {/* チャートタイプ切り替えボタン */}
      <div className="flex justify-center mb-1 text-xs">
        <button 
          onClick={() => setChartType('combined')} 
          className={`px-2 py-0.5 rounded-l-md ${chartType === 'combined' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        >
          複合
        </button>
        <button 
          onClick={() => setChartType('bar')} 
          className={`px-2 py-0.5 ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        >
          棒グラフ
        </button>
        <button 
          onClick={() => setChartType('line')} 
          className={`px-2 py-0.5 ${chartType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        >
          折線
        </button>
        <button 
          onClick={() => setChartType('profit')} 
          className={`px-2 py-0.5 rounded-r-md ${chartType === 'profit' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        >
          利益
        </button>
      </div>
      
      <div className="h-40 md:h-64">
        {chartType === 'combined' && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={recentData}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 8 }} />
              <YAxis 
                yAxisId="left" 
                orientation="left"
                tickFormatter={(value) => `${value / 1000000}M`}
                tick={{ fontSize: 8 }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                domain={[0, Math.max(...recentData.map(d => d.yoyGrowth || 0)) * 1.2]}
                tick={{ fontSize: 8 }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
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
                wrapperStyle={{ fontSize: '8px' }}
              />
              <Bar yAxisId="left" dataKey="total" fill="#8884d8" name="total" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="yoyGrowth"
                stroke="#ff7300"
                name="yoyGrowth"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
        
        {chartType === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={recentData}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 8 }} />
              <YAxis tickFormatter={(value) => `${value / 1000000}M`} tick={{ fontSize: 8 }} />
              <Tooltip 
                formatter={(value: number, name: string) => {
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
                wrapperStyle={{ fontSize: '8px' }}
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
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 8 }} />
              <YAxis tick={{ fontSize: 8 }} />
              <Tooltip 
                formatter={(value: number, name: string) => {
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
                wrapperStyle={{ fontSize: '8px' }}
              />
              <Line type="monotone" dataKey="total" stroke="#8884d8" />
              <Line type="monotone" dataKey="yoyGrowth" stroke="#ff7300" />
              <Line type="monotone" dataKey="momGrowth" stroke="#82ca9d" strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        )}
        
        {chartType === 'profit' && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={recentData}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 8 }} />
              <YAxis 
                tickFormatter={(value) => `${value / 1000000}M`}
                tick={{ fontSize: 8 }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  return [
                    `¥${(value / 1000000).toFixed(2)}M`, 
                    name === 'total' ? '売上高' : 
                    name === 'operatingProfit' ? '営業利益' : 
                    name === 'netProfit' ? '純利益' : name
                  ];
                }}
                labelFormatter={(label) => `${label}月`}
              />
              <Legend 
                formatter={(value) => {
                  return value === 'total' ? '売上高' : 
                         value === 'operatingProfit' ? '営業利益' : 
                         value === 'netProfit' ? '純利益' : value;
                }}
                wrapperStyle={{ fontSize: '8px' }}
              />
              <Bar dataKey="total" fill="#8884d8" />
              <Line type="monotone" dataKey="operatingProfit" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="netProfit" stroke="#ff7300" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
      
      <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
        <p className="text-xs">
          平均成長率: <span className="font-semibold text-orange-500">{avgYoYGrowth.toFixed(1)}%</span> | 
          最高成長月: <span className="font-semibold text-green-500">
            {data.reduce((max, item) => Math.max(max, item.yoyGrowth || 0), 0).toFixed(1)}%
          </span>
        </p>
        <p className="mt-0.5 text-xs">
          営業利益率: <span className="font-semibold text-blue-500">
            {operatingProfitMargin.toFixed(1)}%
          </span> | 
          純利益率: <span className="font-semibold text-green-500">
            {netProfitMargin.toFixed(1)}%
          </span>
        </p>
      </div>
    </div>
  );
};

export default SalesChart; 
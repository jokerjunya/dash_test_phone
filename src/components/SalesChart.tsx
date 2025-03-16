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
    <div className="card overflow-hidden p-2 md:p-4 flex flex-col">
      <h3 className="section-title text-xs md:text-base mb-1 text-white">月次売上推移</h3>
      
      {/* チャートタイプ切り替えボタン */}
      <div className="flex justify-center mb-1 text-xs">
        <button 
          onClick={() => setChartType('combined')} 
          className={`px-2 py-0.5 rounded-l-md ${chartType === 'combined' ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-400'}`}
        >
          複合
        </button>
        <button 
          onClick={() => setChartType('bar')} 
          className={`px-2 py-0.5 ${chartType === 'bar' ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-400'}`}
        >
          棒グラフ
        </button>
        <button 
          onClick={() => setChartType('line')} 
          className={`px-2 py-0.5 ${chartType === 'line' ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-400'}`}
        >
          折線
        </button>
        <button 
          onClick={() => setChartType('profit')} 
          className={`px-2 py-0.5 rounded-r-md ${chartType === 'profit' ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-400'}`}
        >
          利益
        </button>
      </div>
      
      <div className="h-[180px] md:h-[250px]">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" tick={{ fontSize: 8, fill: "#aaa" }} />
              <YAxis 
                yAxisId="left" 
                orientation="left"
                tickFormatter={(value) => `${value / 1000000}M`}
                tick={{ fontSize: 8, fill: "#aaa" }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                domain={[0, Math.max(...recentData.map(d => d.yoyGrowth || 0)) * 1.2]}
                tick={{ fontSize: 8, fill: "#aaa" }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'yoyGrowth') {
                    return [`${value}%`, '前年同月比'];
                  }
                  return [value, name === 'total' ? '合計' : name];
                }}
                labelFormatter={(label) => `${label}月`}
                contentStyle={{ backgroundColor: '#222', borderColor: '#333' }}
                itemStyle={{ color: '#ddd' }}
              />
              <Legend 
                formatter={(value) => {
                  return value === 'total' ? '合計' : 
                         value === 'yoyGrowth' ? '前年比' : value;
                }}
                wrapperStyle={{ fontSize: '8px', color: '#aaa' }}
              />
              <Bar yAxisId="left" dataKey="total" fill="#1DB954" name="total" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="yoyGrowth"
                stroke="#1DB954"
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
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" tick={{ fontSize: 8, fill: "#aaa" }} />
              <YAxis tickFormatter={(value) => `${value / 1000000}M`} tick={{ fontSize: 8, fill: "#aaa" }} />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  return [value, name === 'unitA' ? '事業部A' : name === 'unitB' ? '事業部B' : name === 'unitC' ? '事業部C' : '合計'];
                }}
                labelFormatter={(label) => `${label}月`}
                contentStyle={{ backgroundColor: '#222', borderColor: '#333' }}
                itemStyle={{ color: '#ddd' }}
              />
              <Legend 
                formatter={(value) => {
                  return value === 'unitA' ? '事業部A' : 
                         value === 'unitB' ? '事業部B' : 
                         value === 'unitC' ? '事業部C' : value;
                }}
                wrapperStyle={{ fontSize: '8px', color: '#aaa' }}
              />
              <Bar dataKey="unitA" stackId="a" fill="#1DB954" />
              <Bar dataKey="unitB" stackId="a" fill="#1ED760" />
              <Bar dataKey="unitC" stackId="a" fill="#1AA34A" />
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
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" tick={{ fontSize: 8, fill: "#aaa" }} />
              <YAxis tick={{ fontSize: 8, fill: "#aaa" }} />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'yoyGrowth' || name === 'momGrowth') {
                    return [`${value}%`, name === 'yoyGrowth' ? '前年同月比' : '前月比'];
                  }
                  return [value, name === 'total' ? '合計' : name];
                }}
                labelFormatter={(label) => `${label}月`}
                contentStyle={{ backgroundColor: '#222', borderColor: '#333' }}
                itemStyle={{ color: '#ddd' }}
              />
              <Legend 
                formatter={(value) => {
                  return value === 'total' ? '合計' : 
                         value === 'yoyGrowth' ? '前年比' : 
                         value === 'momGrowth' ? '前月比' : value;
                }}
                wrapperStyle={{ fontSize: '8px', color: '#aaa' }}
              />
              <Line type="monotone" dataKey="total" stroke="#1DB954" />
              <Line type="monotone" dataKey="yoyGrowth" stroke="#1ED760" />
              <Line type="monotone" dataKey="momGrowth" stroke="#1AA34A" strokeDasharray="3 3" />
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
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" tick={{ fontSize: 8, fill: "#aaa" }} />
              <YAxis 
                tickFormatter={(value) => `${value / 1000000}M`}
                tick={{ fontSize: 8, fill: "#aaa" }}
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
                contentStyle={{ backgroundColor: '#222', borderColor: '#333' }}
                itemStyle={{ color: '#ddd' }}
              />
              <Legend 
                formatter={(value) => {
                  return value === 'total' ? '売上高' : 
                         value === 'operatingProfit' ? '営業利益' : 
                         value === 'netProfit' ? '純利益' : value;
                }}
                wrapperStyle={{ fontSize: '8px', color: '#aaa' }}
              />
              <Bar dataKey="total" fill="#1DB954" />
              <Line type="monotone" dataKey="operatingProfit" stroke="#1ED760" strokeWidth={2} />
              <Line type="monotone" dataKey="netProfit" stroke="#1AA34A" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
      
      <div className="mt-1 text-xs text-gray-400">
        <p className="text-xs">
          平均成長率: <span className="font-semibold text-green-500">{avgYoYGrowth.toFixed(1)}%</span> | 
          最高成長月: <span className="font-semibold text-green-500">
            {data.reduce((max, item) => Math.max(max, item.yoyGrowth || 0), 0).toFixed(1)}%
          </span>
        </p>
        <p className="mt-0.5 text-xs">
          営業利益率: <span className="font-semibold text-green-500">
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
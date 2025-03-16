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

  // グラフの色を緑とグレーのスケールに統一
  const colors = {
    total: '#10B981',       // 緑色
    unitA: '#10B981',       // 緑色
    unitB: '#34D399',       // 薄緑色
    unitC: '#6EE7B7',       // さらに薄い緑色
    yoyGrowth: '#94A3B8',   // グレー
    momGrowth: '#CBD5E1',   // 薄いグレー
    operatingProfit: '#059669', // 濃い緑色
    netProfit: '#047857'    // さらに濃い緑色
  };

  return (
    <div className="card overflow-hidden p-2 md:p-4 flex flex-col">
      <h3 className="section-title text-sm md:text-base mb-2 text-white">月次売上推移</h3>
      
      {/* チャートタイプ切り替えボタン */}
      <div className="flex justify-center mb-2 text-xs">
        <button 
          onClick={() => setChartType('combined')} 
          className={`px-2 py-1 rounded-l-md ${chartType === 'combined' ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          複合
        </button>
        <button 
          onClick={() => setChartType('bar')} 
          className={`px-2 py-1 ${chartType === 'bar' ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          棒グラフ
        </button>
        <button 
          onClick={() => setChartType('line')} 
          className={`px-2 py-1 ${chartType === 'line' ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          折線
        </button>
        <button 
          onClick={() => setChartType('profit')} 
          className={`px-2 py-1 rounded-r-md ${chartType === 'profit' ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          利益
        </button>
      </div>
      
      <div className="h-[200px] md:h-[250px]">
        {chartType === 'combined' && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={recentData}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#ddd" }} />
              <YAxis 
                yAxisId="left" 
                orientation="left"
                tickFormatter={(value) => `${value / 1000000}M`}
                tick={{ fontSize: 10, fill: "#ddd" }}
                width={35}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                domain={[0, Math.max(...recentData.map(d => d.yoyGrowth || 0)) * 1.2]}
                tick={{ fontSize: 10, fill: "#ddd" }}
                width={30}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'yoyGrowth') {
                    return [`${value.toFixed(1)}%`, '前年同月比'];
                  }
                  return [`¥${(value / 1000000).toFixed(1)}M`, name === 'total' ? '売上合計' : name];
                }}
                labelFormatter={(label) => `${label}月`}
                contentStyle={{ backgroundColor: '#333', borderColor: '#555', padding: '10px', borderRadius: '4px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend 
                formatter={(value) => {
                  return value === 'total' ? '売上合計' : 
                         value === 'yoyGrowth' ? '前年比' : value;
                }}
                wrapperStyle={{ fontSize: '10px', color: '#ddd', paddingTop: '5px' }}
              />
              <Bar yAxisId="left" dataKey="total" fill={colors.total} name="total" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="yoyGrowth"
                stroke={colors.yoyGrowth}
                name="yoyGrowth"
                strokeWidth={2}
                dot={{ r: 3, fill: colors.yoyGrowth }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
        
        {chartType === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={recentData}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#ddd" }} />
              <YAxis 
                tickFormatter={(value) => `${value / 1000000}M`} 
                tick={{ fontSize: 10, fill: "#ddd" }}
                width={35}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  return [`¥${(value / 1000000).toFixed(1)}M`, 
                    name === 'unitA' ? '事業部A' : 
                    name === 'unitB' ? '事業部B' : 
                    name === 'unitC' ? '事業部C' : '合計'
                  ];
                }}
                labelFormatter={(label) => `${label}月`}
                contentStyle={{ backgroundColor: '#333', borderColor: '#555', padding: '10px', borderRadius: '4px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend 
                formatter={(value) => {
                  return value === 'unitA' ? '事業部A' : 
                         value === 'unitB' ? '事業部B' : 
                         value === 'unitC' ? '事業部C' : value;
                }}
                wrapperStyle={{ fontSize: '10px', color: '#ddd', paddingTop: '5px' }}
              />
              <Bar dataKey="unitA" stackId="a" fill={colors.unitA} />
              <Bar dataKey="unitB" stackId="a" fill={colors.unitB} />
              <Bar dataKey="unitC" stackId="a" fill={colors.unitC} />
            </BarChart>
          </ResponsiveContainer>
        )}
        
        {chartType === 'line' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={recentData}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#ddd" }} />
              <YAxis 
                tick={{ fontSize: 10, fill: "#ddd" }}
                width={35}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'yoyGrowth' || name === 'momGrowth') {
                    return [`${value.toFixed(1)}%`, name === 'yoyGrowth' ? '前年同月比' : '前月比'];
                  }
                  return [`¥${(value / 1000000).toFixed(1)}M`, name === 'total' ? '売上合計' : name];
                }}
                labelFormatter={(label) => `${label}月`}
                contentStyle={{ backgroundColor: '#333', borderColor: '#555', padding: '10px', borderRadius: '4px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend 
                formatter={(value) => {
                  return value === 'total' ? '売上合計' : 
                         value === 'yoyGrowth' ? '前年比' : 
                         value === 'momGrowth' ? '前月比' : value;
                }}
                wrapperStyle={{ fontSize: '10px', color: '#ddd', paddingTop: '5px' }}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke={colors.total} 
                strokeWidth={2}
                dot={{ r: 3, fill: colors.total }}
                activeDot={{ r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="yoyGrowth" 
                stroke={colors.yoyGrowth}
                strokeWidth={2}
                dot={{ r: 3, fill: colors.yoyGrowth }}
                activeDot={{ r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="momGrowth" 
                stroke={colors.momGrowth} 
                strokeDasharray="3 3"
                strokeWidth={2}
                dot={{ r: 3, fill: colors.momGrowth }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        
        {chartType === 'profit' && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={recentData}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#ddd" }} />
              <YAxis 
                tickFormatter={(value) => `${value / 1000000}M`}
                tick={{ fontSize: 10, fill: "#ddd" }}
                width={35}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  return [
                    `¥${(value / 1000000).toFixed(1)}M`, 
                    name === 'total' ? '売上高' : 
                    name === 'operatingProfit' ? '営業利益' : 
                    name === 'netProfit' ? '純利益' : name
                  ];
                }}
                labelFormatter={(label) => `${label}月`}
                contentStyle={{ backgroundColor: '#333', borderColor: '#555', padding: '10px', borderRadius: '4px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend 
                formatter={(value) => {
                  return value === 'total' ? '売上高' : 
                         value === 'operatingProfit' ? '営業利益' : 
                         value === 'netProfit' ? '純利益' : value;
                }}
                wrapperStyle={{ fontSize: '10px', color: '#ddd', paddingTop: '5px' }}
              />
              <Bar dataKey="total" fill={colors.total} />
              <Line 
                type="monotone" 
                dataKey="operatingProfit" 
                stroke={colors.operatingProfit} 
                strokeWidth={2}
                dot={{ r: 3, fill: colors.operatingProfit }}
                activeDot={{ r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="netProfit" 
                stroke={colors.netProfit} 
                strokeWidth={2}
                dot={{ r: 3, fill: colors.netProfit }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
      
      <div className="mt-2 text-xs text-gray-300">
        <p className="text-xs">
          平均成長率: <span className="font-semibold text-emerald-400">{avgYoYGrowth.toFixed(1)}%</span> | 
          最高成長月: <span className="font-semibold text-emerald-400">
            {data.reduce((max, item) => Math.max(max, item.yoyGrowth || 0), 0).toFixed(1)}%
          </span>
        </p>
        <p className="mt-1 text-xs">
          営業利益率: <span className="font-semibold text-emerald-500">
            {operatingProfitMargin.toFixed(1)}%
          </span> | 
          純利益率: <span className="font-semibold text-emerald-500">
            {netProfitMargin.toFixed(1)}%
          </span>
        </p>
      </div>
    </div>
  );
};

export default SalesChart; 
import { RecruitmentData } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useState } from 'react';

interface RecruitmentChartProps {
  data: RecruitmentData[];
}

const RecruitmentChart = ({ data }: RecruitmentChartProps) => {
  const [chartType, setChartType] = useState<'funnel' | 'trend'>('funnel');
  
  // 採用コンバージョン率を計算
  const dataWithRates = data.map(item => {
    const interviewRate = item.interviews / item.applicants * 100;
    const offerRate = item.offers / item.interviews * 100;
    const hireRate = item.hires / item.offers * 100;
    const overallRate = item.hires / item.applicants * 100;
    
    return {
      ...item,
      interviewRate,
      offerRate,
      hireRate,
      overallRate
    };
  });
  
  // モバイル向けに月名を短縮
  const formattedData = dataWithRates.map(item => ({
    ...item,
    month: item.month.replace('月', '') // "1月" → "1"
  }));
  
  // 最新の6ヶ月分のデータのみ表示（モバイル向け）
  const recentData = formattedData.slice(-6);
  
  // 最新月のデータを取得（ファネル表示用）
  const latestMonth = data.length > 0 ? data[data.length - 1] : null;
  
  // ファネル表示用のデータを作成
  const funnelData = latestMonth ? [
    { name: '応募者', value: latestMonth.applicants, fill: '#8884d8' },
    { name: '面接', value: latestMonth.interviews, fill: '#82ca9d' },
    { name: 'オファー', value: latestMonth.offers, fill: '#ffc658' },
    { name: '採用', value: latestMonth.hires, fill: '#ff8042' }
  ] : [];
  
  // 採用率の計算
  const totalApplicants = data.reduce((sum, item) => sum + item.applicants, 0);
  const totalHires = data.reduce((sum, item) => sum + item.hires, 0);
  const overallHireRate = totalApplicants > 0 ? (totalHires / totalApplicants) * 100 : 0;
  
  // 円グラフ用のデータ
  const pieData = [
    { name: '採用', value: totalHires, fill: '#82ca9d' },
    { name: '不採用', value: totalApplicants - totalHires, fill: '#d3d3d3' }
  ];

  return (
    <div className="card overflow-hidden p-2 md:p-4 flex flex-col">
      <h3 className="section-title text-xs md:text-base mb-1 text-white">採用状況</h3>
      
      {/* チャートタイプ切り替えボタン */}
      <div className="flex justify-center mb-1 text-xs">
        <button 
          onClick={() => setChartType('funnel')} 
          className={`px-2 py-0.5 rounded-l-md ${chartType === 'funnel' ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-400'}`}
        >
          ファネル
        </button>
        <button 
          onClick={() => setChartType('trend')} 
          className={`px-2 py-0.5 rounded-r-md ${chartType === 'trend' ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-400'}`}
        >
          トレンド
        </button>
      </div>
      
      <div className="h-[180px] md:h-[250px]">
        {chartType === 'funnel' && (
          <div className="flex flex-col h-full">
            <div className="h-3/5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={funnelData}
                  layout="vertical"
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" tick={{ fontSize: 8, fill: "#aaa" }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 8, fill: "#aaa" }} width={40} />
                  <Tooltip formatter={(value) => [`${value}人`, '']} contentStyle={{ backgroundColor: '#222', borderColor: '#333' }} itemStyle={{ color: '#ddd' }} />
                  <Bar dataKey="value" background={{ fill: '#333' }}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#1DB954' : index === 1 ? '#1ED760' : index === 2 ? '#1AA34A' : '#168F40'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-2/5">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={15}
                    outerRadius={30}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#1DB954' : '#333'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}人`, '']} contentStyle={{ backgroundColor: '#222', borderColor: '#333' }} itemStyle={{ color: '#ddd' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {chartType === 'trend' && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={recentData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" tick={{ fontSize: 8, fill: "#aaa" }} />
              <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 8, fill: "#aaa" }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 8, fill: "#aaa" }} />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'overallRate') {
                    return [`${(value as number).toFixed(1)}%`, '採用率'];
                  }
                  return [value, 
                    name === 'applicants' ? '応募者' : 
                    name === 'interviews' ? '面接' : 
                    name === 'offers' ? 'オファー' : '採用'];
                }}
                labelFormatter={(label) => `${label}月`}
                contentStyle={{ backgroundColor: '#222', borderColor: '#333' }}
                itemStyle={{ color: '#ddd' }}
              />
              <Legend 
                formatter={(value) => {
                  return value === 'applicants' ? '応募者' : 
                         value === 'hires' ? '採用' : 
                         value === 'overallRate' ? '採用率' : '';
                }}
                wrapperStyle={{ fontSize: '8px', color: '#aaa' }}
              />
              <Bar yAxisId="left" dataKey="applicants" fill="#1DB954" />
              <Bar yAxisId="left" dataKey="hires" fill="#1AA34A" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="overallRate"
                stroke="#1ED760"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
      
      <div className="mt-1 text-xs text-gray-400">
        <p className="text-xs">
          総応募者数: <span className="font-semibold text-white">{totalApplicants}人</span> | 
          総採用数: <span className="font-semibold text-white">{totalHires}人</span> | 
          採用率: <span className="font-semibold text-green-500">{overallHireRate.toFixed(1)}%</span>
        </p>
      </div>
    </div>
  );
};

export default RecruitmentChart; 
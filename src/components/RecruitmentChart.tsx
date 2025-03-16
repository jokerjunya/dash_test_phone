import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useState } from 'react';

interface RecruitmentChartProps {
  data: {
    month: string;
    applicants: number;
    hires: number;
  }[];
}

const RecruitmentChart = ({ data }: RecruitmentChartProps) => {
  const [chartType, setChartType] = useState<'funnel' | 'trend'>('funnel');
  
  // 採用コンバージョン率を計算
  const totalApplicants = data.reduce((sum, item) => sum + item.applicants, 0);
  const totalHires = data.reduce((sum, item) => sum + item.hires, 0);
  const hiringRate = totalApplicants > 0 ? (totalHires / totalApplicants) * 100 : 0;
  
  // ファネルチャートのデータ（BarChartで表現）
  const funnelData = [
    { name: '応募者', value: totalApplicants, fill: '#8884d8' },
    { name: '一次面接', value: Math.round(totalApplicants * 0.7), fill: '#83a6ed' },
    { name: '二次面接', value: Math.round(totalApplicants * 0.4), fill: '#8dd1e1' },
    { name: '内定', value: Math.round(totalApplicants * 0.25), fill: '#82ca9d' },
    { name: '入社', value: totalHires, fill: '#a4de6c' }
  ];
  
  // 円グラフのデータ
  const pieData = [
    { name: '採用', value: totalHires, fill: '#82ca9d' },
    { name: '不採用', value: totalApplicants - totalHires, fill: '#d3d3d3' }
  ];
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">採用状況</h2>
      
      {/* チャートタイプの切り替えボタン */}
      <div className="flex space-x-2 mb-4">
        <button
          className={`px-3 py-1 rounded text-sm ${chartType === 'funnel' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setChartType('funnel')}
        >
          採用フロー
        </button>
        <button
          className={`px-3 py-1 rounded text-sm ${chartType === 'trend' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setChartType('trend')}
        >
          採用率
        </button>
      </div>
      
      {/* 採用統計 */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-400">応募者数</p>
          <p className="text-xl font-bold text-white">{totalApplicants}</p>
        </div>
        
        <div className="bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-400">採用者数</p>
          <p className="text-xl font-bold text-white">{totalHires}</p>
        </div>
        
        <div className="bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-400">採用率</p>
          <p className="text-xl font-bold text-white">{hiringRate.toFixed(1)}%</p>
        </div>
      </div>
      
      {/* チャート表示 */}
      <div className="h-64">
        {chartType === 'funnel' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={funnelData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {funnelData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={funnelData[index].fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={pieData[index].fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RecruitmentChart; 
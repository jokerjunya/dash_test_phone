import { useState, useEffect } from 'react'
import './App.css'
import SalesChart from './components/SalesChart'
import RecruitmentChart from './components/RecruitmentChart'
import { salesData as initialSalesData, recruitmentData as initialRecruitmentData } from './data/dummyData'
import { SalesData, RecruitmentData, KPI } from './types'
import BusinessInsights from './components/BusinessInsights'

// 初期KPIデータ
const initialKpiData: KPI[] = [
  { title: '売上高', value: '¥0M', change: 0, isPositive: true },
  { title: '営業利益', value: '¥0M', change: 0, isPositive: true },
  { title: '純利益', value: '¥0M', change: 0, isPositive: true },
  { title: '前年比成長率', value: '0%', change: 0, isPositive: true },
  { title: '顧客単価', value: '¥0K', change: 0, isPositive: true },
  { title: '従業員数', value: 0, change: 0, isPositive: true },
  { title: '採用数', value: 0, change: 0, isPositive: true },
  { title: '採用率', value: '0%', change: 0, isPositive: true },
];

function App() {
  const [salesData] = useState<SalesData[]>(initialSalesData)
  const [recruitmentData] = useState<RecruitmentData[]>(initialRecruitmentData)
  const [kpiData, setKpiData] = useState<KPI[]>(initialKpiData)
  const [lastUpdated] = useState<string>(new Date().toLocaleDateString('ja-JP', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }))
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'insights' | 'sales' | 'recruitment'>('dashboard')

  // KPIデータを計算
  useEffect(() => {
    // 売上データからKPIを計算
    const totalSales = salesData.reduce((sum, item) => sum + item.total, 0);
    
    // 営業利益の計算
    const totalOperatingProfit = salesData.reduce((sum, item) => sum + (item.operatingProfit || 0), 0);
    const operatingProfitMargin = (totalOperatingProfit / totalSales) * 100;
    
    // 純利益の計算
    const totalNetProfit = salesData.reduce((sum, item) => sum + (item.netProfit || 0), 0);
    const netProfitMargin = (totalNetProfit / totalSales) * 100;
    
    // 採用データからKPIを計算
    const totalHires = recruitmentData.reduce((sum, item) => sum + item.hires, 0);
    const totalApplicants = recruitmentData.reduce((sum, item) => sum + item.applicants, 0);
    const hiringRate = totalApplicants ? (totalHires / totalApplicants) * 100 : 0;
    
    // YoY成長率の計算
    const lastMonthYoYGrowth = salesData.length > 0 ? salesData[salesData.length - 1].yoyGrowth || 0 : 0;
    
    // 顧客単価の計算
    const lastMonthCustomerPrice = salesData.length > 0 ? salesData[salesData.length - 1].customerPrice || 0 : 0;
    const customerPriceYoYGrowth = 7.5; // ダミーの前年比成長率
    
    // 従業員数の計算
    const currentEmployees = salesData.length > 0 ? salesData[salesData.length - 1].employees || 0 : 0;
    const employeeGrowthRate = 10.0; // ダミーの成長率
    
    // KPIデータを更新
    const newKpiData: KPI[] = [
      { 
        title: '売上高', 
        value: `¥${(totalSales / 1000000).toFixed(2)}M`, 
        change: lastMonthYoYGrowth, 
        isPositive: lastMonthYoYGrowth > 0 
      },
      { 
        title: '営業利益', 
        value: `¥${(totalOperatingProfit / 1000000).toFixed(2)}M`, 
        change: operatingProfitMargin > 15 ? 5.2 : -2.1, 
        isPositive: operatingProfitMargin > 15
      },
      { 
        title: '純利益', 
        value: `¥${(totalNetProfit / 1000000).toFixed(2)}M`, 
        change: netProfitMargin > 12 ? 6.8 : -1.5, 
        isPositive: netProfitMargin > 12
      },
      { 
        title: '前年比成長率', 
        value: `${lastMonthYoYGrowth.toFixed(1)}%`, 
        change: lastMonthYoYGrowth - 10, 
        isPositive: lastMonthYoYGrowth > 10
      },
      { 
        title: '顧客単価', 
        value: `¥${lastMonthCustomerPrice.toFixed(2)}K`, 
        change: customerPriceYoYGrowth, 
        isPositive: customerPriceYoYGrowth > 0 
      },
      { 
        title: '従業員数', 
        value: currentEmployees, 
        change: employeeGrowthRate, 
        isPositive: employeeGrowthRate > 0 
      },
      { 
        title: '採用数', 
        value: totalHires, 
        change: 15.5, 
        isPositive: true 
      },
      { 
        title: '採用率', 
        value: `${hiringRate.toFixed(1)}%`, 
        change: 1.2, 
        isPositive: true 
      },
    ];
    
    setKpiData(newKpiData);
  }, [salesData, recruitmentData]);

  // ダークモードの設定をbodyに適用
  useEffect(() => {
    // Spotifyスタイルのため、常にダークモードを適用
    document.documentElement.classList.add('dark');
    setDarkMode(true);
  }, []);

  // タブ切り替え用のナビゲーションコンポーネント
  const MobileNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 shadow-md border-t border-gray-800 z-10">
      <div className="flex justify-around">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`flex-1 py-3 flex flex-col items-center justify-center ${activeTab === 'dashboard' ? 'text-green-500 border-t-2 border-green-500' : 'text-gray-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-xs mt-1">KPI</span>
        </button>
        <button 
          onClick={() => setActiveTab('insights')} 
          className={`flex-1 py-3 flex flex-col items-center justify-center ${activeTab === 'insights' ? 'text-green-500 border-t-2 border-green-500' : 'text-gray-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs mt-1">分析</span>
        </button>
        <button 
          onClick={() => setActiveTab('sales')} 
          className={`flex-1 py-3 flex flex-col items-center justify-center ${activeTab === 'sales' ? 'text-green-500 border-t-2 border-green-500' : 'text-gray-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          <span className="text-xs mt-1">売上</span>
        </button>
        <button 
          onClick={() => setActiveTab('recruitment')} 
          className={`flex-1 py-3 flex flex-col items-center justify-center ${activeTab === 'recruitment' ? 'text-green-500 border-t-2 border-green-500' : 'text-gray-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-xs mt-1">採用</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="p-3 pb-20 max-w-md mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-lg font-bold text-white">
              CEO Dashboard
            </h1>
            <p className="text-xs text-gray-400">
              最終更新: {lastUpdated}
            </p>
          </div>
          <div className="p-2 bg-gray-900 rounded-lg text-gray-200">
            <span className="text-green-500">●</span>
          </div>
        </div>

        {/* ダッシュボードタブ */}
        {activeTab === 'dashboard' && (
          <>
            {/* KPIカード */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {kpiData.map((kpi: KPI, index: number) => (
                <div
                  key={index}
                  className="bg-gray-900 p-3 rounded-lg shadow-sm"
                >
                  <h3 className="text-xs text-gray-400">{kpi.title}</h3>
                  <p className="text-base font-semibold text-white mt-1">
                    {kpi.value}
                  </p>
                  <div className={`text-xs mt-1 ${kpi.isPositive ? 'text-green-500' : 'text-gray-400'}`}>
                    {kpi.isPositive ? '↑' : '↓'} {kpi.change}%
                  </div>
                </div>
              ))}
            </div>

            {/* 重要なインサイトのサマリー */}
            <div className="bg-gray-900 p-3 rounded-lg shadow-sm mb-4">
              <h2 className="text-base font-semibold mb-2 text-white">今月のハイライト</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-xs text-gray-300">売上は前年比15.5%増加しています</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-xs text-gray-300">営業利益率は20%を維持しています</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">⚠</span>
                  <span className="text-xs text-gray-300">従業員増加率が売上成長率を上回っています</span>
                </li>
              </ul>
            </div>
          </>
        )}

        {/* インサイトタブ */}
        {activeTab === 'insights' && (
          <BusinessInsights data={salesData} />
        )}

        {/* 売上タブ */}
        {activeTab === 'sales' && (
          <div className="bg-gray-900 p-3 rounded-lg shadow-sm">
            <h2 className="text-base font-semibold mb-2 text-white">
              売上推移
            </h2>
            <SalesChart data={salesData} />
          </div>
        )}

        {/* 採用タブ */}
        {activeTab === 'recruitment' && (
          <div className="bg-gray-900 p-3 rounded-lg shadow-sm">
            <h2 className="text-base font-semibold mb-2 text-white">
              採用状況
            </h2>
            <RecruitmentChart data={recruitmentData} />
          </div>
        )}

        {/* モバイルナビゲーション */}
        <MobileNavigation />

        {/* フッター */}
        <footer className="mt-8 text-center text-xs text-gray-500 pb-16">
          <p>© 2024 リクルート ダッシュボード | v1.0.0</p>
        </footer>
      </div>
    </div>
  )
}

export default App

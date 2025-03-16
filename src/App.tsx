import { useState, useEffect } from 'react'
import './App.css'
import KPICard from './components/KPICard'
import SalesChart from './components/SalesChart'
import RecruitmentChart from './components/RecruitmentChart'
import CSVImporter from './components/CSVImporter'
import { salesData as initialSalesData, recruitmentData as initialRecruitmentData } from './data/dummyData'
import { SalesData, RecruitmentData, KPI } from './types'

function App() {
  const [salesData, setSalesData] = useState<SalesData[]>(initialSalesData)
  const [recruitmentData, setRecruitmentData] = useState<RecruitmentData[]>(initialRecruitmentData)
  const [kpiData, setKpiData] = useState<KPI[]>([])
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleDateString('ja-JP', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }))
  const [activeTab, setActiveTab] = useState<'kpi' | 'sales' | 'recruitment'>('kpi')

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

  // CSVデータのインポート処理
  const handleSalesDataImport = (data: SalesData[]) => {
    setSalesData(data);
    setLastUpdated(new Date().toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }));
  };

  const handleRecruitmentDataImport = (data: RecruitmentData[]) => {
    setRecruitmentData(data);
    setLastUpdated(new Date().toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }));
  };

  // タブ切り替え用のナビゲーションコンポーネント
  const MobileNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 z-10">
      <div className="flex justify-around">
        <button 
          onClick={() => setActiveTab('kpi')} 
          className={`flex-1 py-3 flex flex-col items-center justify-center ${activeTab === 'kpi' ? 'text-blue-600 dark:text-blue-400 border-t-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-xs mt-1">KPI</span>
        </button>
        <button 
          onClick={() => setActiveTab('sales')} 
          className={`flex-1 py-3 flex flex-col items-center justify-center ${activeTab === 'sales' ? 'text-blue-600 dark:text-blue-400 border-t-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          <span className="text-xs mt-1">売上</span>
        </button>
        <button 
          onClick={() => setActiveTab('recruitment')} 
          className={`flex-1 py-3 flex flex-col items-center justify-center ${activeTab === 'recruitment' ? 'text-blue-600 dark:text-blue-400 border-t-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-xs mt-1">採用</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-4 px-3 pb-20">
      <div className="max-w-lg mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">採用・営業ダッシュボード</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            CEO意思決定支援ツール
            <span className="text-xs ml-2 text-gray-500 block">（最終更新: {lastUpdated}）</span>
          </p>
        </header>

        {/* CSVインポーター */}
        <CSVImporter 
          onSalesDataImport={handleSalesDataImport}
          onRecruitmentDataImport={handleRecruitmentDataImport}
        />

        {/* タブコンテンツ */}
        <div className="mt-6">
          {/* KPIセクション */}
          {activeTab === 'kpi' && (
            <section className="dashboard-section">
              <h2 className="section-title">主要業績指標</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {kpiData.map((kpi, index) => (
                  <KPICard key={index} kpi={kpi} />
                ))}
              </div>
            </section>
          )}

          {/* 売上データセクション */}
          {activeTab === 'sales' && (
            <section className="dashboard-section">
              <SalesChart data={salesData} />
            </section>
          )}

          {/* 採用データセクション */}
          {activeTab === 'recruitment' && (
            <section className="dashboard-section">
              <RecruitmentChart data={recruitmentData} />
            </section>
          )}
        </div>

        {/* モバイルナビゲーション */}
        <MobileNavigation />

        {/* フッター */}
        <footer className="mt-10 text-center text-xs text-gray-500 dark:text-gray-400 pb-16">
          <p>© 2024 リクルート ダッシュボード | バージョン 1.0.0</p>
          <p className="mt-1">データは毎月更新されます。最終更新: {lastUpdated}</p>
        </footer>
      </div>
    </div>
  )
}

export default App

import { SalesData, RecruitmentData, KPI } from '../types';

// 売上データ
export const salesData: SalesData[] = [
  { 
    month: '1月', 
    unitA: 1200000, 
    unitB: 800000, 
    unitC: 600000, 
    total: 2600000, 
    operatingProfit: 520000, 
    netProfit: 390000, 
    customerPrice: 216.67, 
    employees: 1200, 
    yoyGrowth: 5.2, 
    momGrowth: 1.2 
  },
  { 
    month: '2月', 
    unitA: 1320000, 
    unitB: 850000, 
    unitC: 630000, 
    total: 2800000, 
    operatingProfit: 560000, 
    netProfit: 420000, 
    customerPrice: 224.00, 
    employees: 1210, 
    yoyGrowth: 6.8, 
    momGrowth: 7.7 
  },
  { 
    month: '3月', 
    unitA: 1450000, 
    unitB: 900000, 
    unitC: 680000, 
    total: 3030000, 
    operatingProfit: 606000, 
    netProfit: 454500, 
    customerPrice: 235.66, 
    employees: 1225, 
    yoyGrowth: 8.2, 
    momGrowth: 8.2 
  },
  { 
    month: '4月', 
    unitA: 1500000, 
    unitB: 880000, 
    unitC: 720000, 
    total: 3100000, 
    operatingProfit: 620000, 
    netProfit: 465000, 
    customerPrice: 238.46, 
    employees: 1240, 
    yoyGrowth: 7.5, 
    momGrowth: 2.3 
  },
  { 
    month: '5月', 
    unitA: 1480000, 
    unitB: 920000, 
    unitC: 750000, 
    total: 3150000, 
    operatingProfit: 630000, 
    netProfit: 472500, 
    customerPrice: 240.46, 
    employees: 1245, 
    yoyGrowth: 9.0, 
    momGrowth: 1.6 
  },
  { 
    month: '6月', 
    unitA: 1550000, 
    unitB: 950000, 
    unitC: 800000, 
    total: 3300000, 
    operatingProfit: 660000, 
    netProfit: 495000, 
    customerPrice: 250.00, 
    employees: 1260, 
    yoyGrowth: 10.5, 
    momGrowth: 4.8 
  },
  { 
    month: '7月', 
    unitA: 1600000, 
    unitB: 1000000, 
    unitC: 850000, 
    total: 3450000, 
    operatingProfit: 690000, 
    netProfit: 517500, 
    customerPrice: 258.65, 
    employees: 1275, 
    yoyGrowth: 12.0, 
    momGrowth: 4.5 
  },
  { 
    month: '8月', 
    unitA: 1580000, 
    unitB: 980000, 
    unitC: 820000, 
    total: 3380000, 
    operatingProfit: 676000, 
    netProfit: 507000, 
    customerPrice: 253.38, 
    employees: 1280, 
    yoyGrowth: 9.8, 
    momGrowth: -2.0 
  },
  { 
    month: '9月', 
    unitA: 1650000, 
    unitB: 1050000, 
    unitC: 880000, 
    total: 3580000, 
    operatingProfit: 716000, 
    netProfit: 537000, 
    customerPrice: 265.19, 
    employees: 1290, 
    yoyGrowth: 11.5, 
    momGrowth: 5.9 
  },
  { 
    month: '10月', 
    unitA: 1750000, 
    unitB: 1100000, 
    unitC: 920000, 
    total: 3770000, 
    operatingProfit: 754000, 
    netProfit: 565500, 
    customerPrice: 275.18, 
    employees: 1300, 
    yoyGrowth: 13.2, 
    momGrowth: 5.3 
  },
  { 
    month: '11月', 
    unitA: 1800000, 
    unitB: 1150000, 
    unitC: 950000, 
    total: 3900000, 
    operatingProfit: 780000, 
    netProfit: 585000, 
    customerPrice: 283.64, 
    employees: 1310, 
    yoyGrowth: 14.0, 
    momGrowth: 3.4 
  },
  { 
    month: '12月', 
    unitA: 1900000, 
    unitB: 1200000, 
    unitC: 1000000, 
    total: 4100000, 
    operatingProfit: 820000, 
    netProfit: 615000, 
    customerPrice: 295.65, 
    employees: 1320, 
    yoyGrowth: 15.5, 
    momGrowth: 5.1 
  },
];

// 採用データ
export const recruitmentData: RecruitmentData[] = [
  { month: '1月', applicants: 150, interviews: 75, offers: 30, hires: 25 },
  { month: '2月', applicants: 165, interviews: 82, offers: 33, hires: 28 },
  { month: '3月', applicants: 180, interviews: 90, offers: 36, hires: 30 },
  { month: '4月', applicants: 200, interviews: 100, offers: 40, hires: 35 },
  { month: '5月', applicants: 210, interviews: 105, offers: 42, hires: 36 },
  { month: '6月', applicants: 220, interviews: 110, offers: 44, hires: 38 },
  { month: '7月', applicants: 240, interviews: 120, offers: 48, hires: 42 },
  { month: '8月', applicants: 230, interviews: 115, offers: 46, hires: 40 },
  { month: '9月', applicants: 250, interviews: 125, offers: 50, hires: 43 },
  { month: '10月', applicants: 270, interviews: 135, offers: 54, hires: 47 },
  { month: '11月', applicants: 280, interviews: 140, offers: 56, hires: 48 },
  { month: '12月', applicants: 300, interviews: 150, offers: 60, hires: 52 },
];

// KPIデータ
export const kpiData: KPI[] = [
  { title: '年間売上', value: '$40.16M', change: 10.2, isPositive: true },
  { title: '月間売上成長率', value: '5.1%', change: 0.3, isPositive: true },
  { title: '年間採用数', value: 464, change: 15.5, isPositive: true },
  { title: '採用コンバージョン率', value: '17.3%', change: 1.2, isPositive: true },
]; 
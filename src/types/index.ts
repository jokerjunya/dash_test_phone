// 売上データの型定義
export interface SalesData {
  month: string;
  unitA: number;
  unitB: number;
  unitC: number;
  total: number;
  yoyGrowth?: number;
  momGrowth?: number;
}

// 採用データの型定義
export interface RecruitmentData {
  month: string;
  applicants: number;
  interviews: number;
  offers: number;
  hires: number;
}

// KPIの型定義
export interface KPI {
  title: string;
  value: string | number;
  change: number;
  isPositive: boolean;
}

// CSVインポートエラーの型定義
export interface CSVImportError {
  message: string;
  type: 'error' | 'warning';
  details?: string;
}

// 新しいCSVフォーマットの売上データ
export interface SalesDataCSV {
  Month: string;
  Total_Sales: string;
  Business_Unit_A: string;
  Business_Unit_B: string;
  Business_Unit_C: string;
}

// 新しいCSVフォーマットの採用データ
export interface RecruitmentDataCSV {
  Month: string;
  Applicants: string;
  Interviews: string;
  Offers: string;
  Hires: string;
} 
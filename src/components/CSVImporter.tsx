import { useState } from 'react';
import Papa from 'papaparse';
import { SalesData, RecruitmentData, CSVImportError } from '../types';
import CSVDownloadSample from './CSVDownloadSample';

interface CSVImporterProps {
  onSalesDataImport: (data: SalesData[]) => void;
  onRecruitmentDataImport: (data: RecruitmentData[]) => void;
}

const CSVImporter = ({ onSalesDataImport, onRecruitmentDataImport }: CSVImporterProps) => {
  const [importType, setImportType] = useState<'sales' | 'recruitment'>('sales');
  const [error, setError] = useState<CSVImportError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [importSuccess, setImportSuccess] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // CSVフォーマットの検証
  const validateSalesCSV = (data: any[]): CSVImportError | null => {
    if (data.length === 0) {
      return { message: 'CSVファイルにデータがありません', type: 'error' };
    }

    const requiredFields = ['Month', 'Total_Sales', 'Business_Unit_A', 'Business_Unit_B', 'Business_Unit_C'];
    const firstRow = data[0];
    
    const missingFields = requiredFields.filter(field => !(field in firstRow));
    if (missingFields.length > 0) {
      // 従来のフォーマットもチェック
      const legacyFields = ['month', 'total', 'unitA', 'unitB', 'unitC'];
      const missingLegacyFields = legacyFields.filter(field => !(field in firstRow));
      
      if (missingLegacyFields.length > 0) {
        return { 
          message: '必須フィールドが不足しています', 
          type: 'error',
          details: `不足しているフィールド: ${missingFields.join(', ')}` 
        };
      } else {
        return { 
          message: '従来のCSVフォーマットが検出されました', 
          type: 'warning',
          details: '新しいフォーマット (Month,Total_Sales,Business_Unit_A,Business_Unit_B,Business_Unit_C) を推奨します' 
        };
      }
    }

    return null;
  };

  // 採用データのCSV検証
  const validateRecruitmentCSV = (data: any[]): CSVImportError | null => {
    if (data.length === 0) {
      return { message: 'CSVファイルにデータがありません', type: 'error' };
    }

    const requiredFields = ['Month', 'Applicants', 'Interviews', 'Offers', 'Hires'];
    const firstRow = data[0];
    
    const missingFields = requiredFields.filter(field => !(field in firstRow));
    if (missingFields.length > 0) {
      // 従来のフォーマットもチェック
      const legacyFields = ['month', 'applicants', 'interviews', 'offers', 'hires'];
      const missingLegacyFields = legacyFields.filter(field => !(field in firstRow));
      
      if (missingLegacyFields.length > 0) {
        return { 
          message: '必須フィールドが不足しています', 
          type: 'error',
          details: `不足しているフィールド: ${missingFields.join(', ')}` 
        };
      } else {
        return { 
          message: '従来のCSVフォーマットが検出されました', 
          type: 'warning',
          details: '新しいフォーマット (Month,Applicants,Interviews,Offers,Hires) を推奨します' 
        };
      }
    }

    return null;
  };

  // 売上データの変換
  const convertSalesData = (data: any[]): SalesData[] => {
    return data.map(row => {
      // 新しいフォーマットかどうかを確認
      const isNewFormat = 'Month' in row && 'Total_Sales' in row;
      
      // 新しいフォーマットの場合
      if (isNewFormat) {
        const salesData: SalesData = {
          month: row.Month,
          total: Number(row.Total_Sales.replace(/[^0-9.-]+/g, '')),
          unitA: Number(row.Business_Unit_A.replace(/[^0-9.-]+/g, '')),
          unitB: Number(row.Business_Unit_B.replace(/[^0-9.-]+/g, '')),
          unitC: Number(row.Business_Unit_C.replace(/[^0-9.-]+/g, '')),
        };
        
        // オプションフィールド
        if ('YoY_Growth' in row) {
          salesData.yoyGrowth = Number(row.YoY_Growth.replace(/[^0-9.-]+/g, ''));
        }
        
        if ('MoM_Growth' in row) {
          salesData.momGrowth = Number(row.MoM_Growth.replace(/[^0-9.-]+/g, ''));
        }
        
        return salesData;
      } 
      // 従来のフォーマットの場合
      else {
        return {
          month: row.month,
          total: Number(row.total),
          unitA: Number(row.unitA),
          unitB: Number(row.unitB),
          unitC: Number(row.unitC),
          yoyGrowth: row.yoyGrowth ? Number(row.yoyGrowth) : undefined,
          momGrowth: row.momGrowth ? Number(row.momGrowth) : undefined,
        };
      }
    });
  };

  // 採用データの変換
  const convertRecruitmentData = (data: any[]): RecruitmentData[] => {
    return data.map(row => {
      // 新しいフォーマットかどうかを確認
      const isNewFormat = 'Month' in row && 'Applicants' in row;
      
      // 新しいフォーマットの場合
      if (isNewFormat) {
        return {
          month: row.Month,
          applicants: Number(row.Applicants.replace(/[^0-9.-]+/g, '')),
          interviews: Number(row.Interviews.replace(/[^0-9.-]+/g, '')),
          offers: Number(row.Offers.replace(/[^0-9.-]+/g, '')),
          hires: Number(row.Hires.replace(/[^0-9.-]+/g, '')),
        };
      } 
      // 従来のフォーマットの場合
      else {
        return {
          month: row.month,
          applicants: Number(row.applicants),
          interviews: Number(row.interviews),
          offers: Number(row.offers),
          hires: Number(row.hires),
        };
      }
    });
  };

  // ファイルアップロード処理
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);
    setIsLoading(true);
    setImportSuccess(false);

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setIsLoading(false);
        
        // データの検証
        const validationError = importType === 'sales' 
          ? validateSalesCSV(results.data) 
          : validateRecruitmentCSV(results.data);
        
        if (validationError && validationError.type === 'error') {
          setError(validationError);
          return;
        }
        
        // 警告がある場合は表示するが、処理は続行
        if (validationError && validationError.type === 'warning') {
          setError(validationError);
        }
        
        try {
          // データの変換と処理
          if (importType === 'sales') {
            const salesData = convertSalesData(results.data);
            onSalesDataImport(salesData);
          } else {
            const recruitmentData = convertRecruitmentData(results.data);
            onRecruitmentDataImport(recruitmentData);
          }
          
          setImportSuccess(true);
        } catch (err) {
          setError({ 
            message: 'データの処理中にエラーが発生しました', 
            type: 'error',
            details: err instanceof Error ? err.message : '不明なエラー'
          });
        }
      },
      error: (error) => {
        setIsLoading(false);
        setError({ 
          message: 'CSVファイルの解析中にエラーが発生しました', 
          type: 'error',
          details: error.message
        });
      }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 mb-4">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        <span>データインポート</span>
        <svg 
          className={`w-5 h-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="mt-3">
          <div className="flex flex-col space-y-3">
            <div className="flex space-x-2">
              <button
                onClick={() => setImportType('sales')}
                className={`px-3 py-1 text-xs rounded-md ${
                  importType === 'sales'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                売上データ
              </button>
              <button
                onClick={() => setImportType('recruitment')}
                className={`px-3 py-1 text-xs rounded-md ${
                  importType === 'recruitment'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                採用データ
              </button>
            </div>
            
            <div className="flex flex-col">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                {importType === 'sales' ? '売上データCSV' : '採用データCSV'}をインポート:
              </label>
              
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <label className="relative cursor-pointer bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded-md">
                    <span>ファイルを選択</span>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="sr-only"
                    />
                  </label>
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                    {fileName || 'ファイルが選択されていません'}
                  </span>
                </div>
                
                <CSVDownloadSample type={importType} />
              </div>
            </div>
            
            {isLoading && (
              <div className="text-xs text-blue-500 dark:text-blue-400">
                データを処理中...
              </div>
            )}
            
            {error && (
              <div className={`text-xs ${error.type === 'error' ? 'text-red-500 dark:text-red-400' : 'text-yellow-500 dark:text-yellow-400'}`}>
                <p className="font-medium">{error.message}</p>
                {error.details && <p className="mt-1">{error.details}</p>}
              </div>
            )}
            
            {importSuccess && (
              <div className="text-xs text-green-500 dark:text-green-400">
                {importType === 'sales' ? '売上データ' : '採用データ'}が正常にインポートされました！
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVImporter; 
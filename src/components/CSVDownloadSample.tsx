interface CSVDownloadSampleProps {
  type: 'sales' | 'recruitment';
}

const CSVDownloadSample = ({ type }: CSVDownloadSampleProps) => {
  const generateSampleSalesCSV = (): string => {
    const header = 'Month,Total_Sales,Business_Unit_A,Business_Unit_B,Business_Unit_C,YoY_Growth,MoM_Growth\n';
    const rows = [
      '1月,2600000,1200000,800000,600000,5.2,1.2',
      '2月,2800000,1320000,850000,630000,6.8,7.7',
      '3月,3030000,1450000,900000,680000,8.2,8.2'
    ];
    return header + rows.join('\n');
  };

  const generateSampleRecruitmentCSV = (): string => {
    const header = 'Month,Applicants,Interviews,Offers,Hires\n';
    const rows = [
      '1月,150,75,30,25',
      '2月,165,82,33,28',
      '3月,180,90,36,30'
    ];
    return header + rows.join('\n');
  };

  const handleDownload = () => {
    const csvContent = type === 'sales' 
      ? generateSampleSalesCSV() 
      : generateSampleRecruitmentCSV();
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', type === 'sales' ? 'sample_sales_data.csv' : 'sample_recruitment_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center"
    >
      <svg 
        className="w-3 h-3 mr-1" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
        />
      </svg>
      サンプルCSVをダウンロード
    </button>
  );
};

export default CSVDownloadSample; 
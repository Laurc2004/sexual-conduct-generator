import React, { useState, useEffect } from "react";
import { toast } from 'react-hot-toast';
import { jsPDF } from "jspdf";
// import CustomDialog from "../components/CustomDialog";

interface AgreementData {
  id: string;
  title: string;
  parties: {
    party1: string;
    party2: string;
  };
  content: string;
  createdAt: string;
  status: "draft" | "signed";
  signatures?: {
    party1?: string;
    party2?: string;
  };
}

const AgreementManage: React.FC = () => {
  const [agreements, setAgreements] = useState<AgreementData[]>([]);
  const [selectedAgreement, setSelectedAgreement] = useState<AgreementData | null>(null);

  useEffect(() => {
    // 从localStorage加载协议
    loadAgreements();
  }, []);

  const loadAgreements = () => {
    const storedAgreements = JSON.parse(localStorage.getItem("agreements") || "[]");
    setAgreements(storedAgreements.sort((a: AgreementData, b: AgreementData) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  };

  const handleSelectAgreement = (agreement: AgreementData) => {
    setSelectedAgreement(agreement);
  };

  // 删除 handleDeleteAgreement 函数

  const exportToPDF = (agreement: AgreementData) => {
    const doc = new jsPDF();
    
    // 添加中文字体支持
    doc.addFont('/fonts/仿宋_GB2312.ttf', 'FangSong', 'normal');
    doc.setFont('FangSong');
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 30;
    const contentWidth = pageWidth - 2 * margin;
    
    // 标题
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text(agreement.title, pageWidth / 2, 20, { align: "center" });
    
    // 双方信息
    doc.setFontSize(14);
    doc.text(`甲方: ${agreement.parties.party1}`, margin, 45);
    doc.text(`乙方: ${agreement.parties.party2}`, margin, 55);
    
    // 协议内容
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("协议内容:", margin, 70);
    
    // 缩小字体和调整行距
    doc.setFontSize(12);
    const splitContent = doc.splitTextToSize(agreement.content, contentWidth);
    doc.text(splitContent, margin, 80, { lineHeightFactor: 1.2 });
    
    // 签名部分
    let yPos = 80 + splitContent.length * 5 + 15;
    
    if (agreement.signatures) {
      doc.text("签名:", margin, yPos);
      yPos += 8;
      
      if (agreement.signatures.party1) {
        doc.text(`甲方签名:`, margin, yPos);
        doc.addImage(agreement.signatures.party1, "PNG", margin + 50, yPos - 10, 40, 15);
        yPos += 20;
      }
      
      if (agreement.signatures.party2) {
        doc.text(`乙方签名:`, margin, yPos);
        doc.addImage(agreement.signatures.party2, "PNG", margin + 50, yPos - 10, 40, 15);
      }
    }
    
    // 保存PDF
    doc.save(`${agreement.title}.pdf`);
    
    toast.success("导出成功");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">管理同意协议</h2>

      {agreements.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">暂无协议</div>
      ) : selectedAgreement ? (
        <div>
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h3>{selectedAgreement.title}</h3>
            <div className="text-xs text-gray-500 mb-2">
              创建于: {new Date(selectedAgreement.createdAt).toLocaleString()}
              <span className="ml-2">
                状态: {selectedAgreement.status === "signed" ? "已签署" : "草稿"}
              </span>
            </div>
            <p>
              <strong>甲方：</strong> {selectedAgreement.parties.party1}
              {selectedAgreement.signatures?.party1 && " (已签名)"}
            </p>
            <p>
              <strong>乙方：</strong> {selectedAgreement.parties.party2}
              {selectedAgreement.signatures?.party2 && " (已签名)"}
            </p>
            <div className="border border-gray-200 p-2 my-2 text-left whitespace-pre-wrap max-h-48 overflow-y-auto">
              {selectedAgreement.content}
            </div>

            {selectedAgreement.signatures && (
              <div>
                <h4>签名</h4>
                <div className="flex justify-around">
                  {selectedAgreement.signatures.party1 && (
                    <div>
                      <p>甲方签名</p>
                      <img
                        src={selectedAgreement.signatures.party1}
                        alt="甲方签名"
                        className="max-w-[120px] border border-gray-200"
                      />
                    </div>
                  )}
                  {selectedAgreement.signatures.party2 && (
                    <div>
                      <p>乙方签名</p>
                      <img
                        src={selectedAgreement.signatures.party2}
                        alt="乙方签名"
                        style={{ maxWidth: "120px", border: "1px solid #eee" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-center mt-4 space-x-2">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => exportToPDF(selectedAgreement)}
              >
                导出PDF
              </button>
              <button 
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                onClick={() => setSelectedAgreement(null)}
              >
                返回列表
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2 mt-4">
          <h3 className="text-lg font-medium px-2">协议列表</h3>
          {agreements.map((agreement) => (
            <div 
              key={agreement.id}
              className="p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleSelectAgreement(agreement)}
            >
              <div className="font-medium">{agreement.title}</div>
              <div className="text-xs text-gray-500">
                创建于: {new Date(agreement.createdAt).toLocaleString()}
                <span className="ml-2">
                  状态: {agreement.status === "signed" ? "已签署" : "草稿"}
                </span>
              </div>
              <div className="flex justify-end mt-1 space-x-2">
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    exportToPDF(agreement);
                  }}
                >
                  导出
                </button>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectAgreement(agreement);
                  }}
                >
                  详情
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgreementManage;
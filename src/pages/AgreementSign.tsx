import React, { useState, useRef, useEffect } from "react";
import { toast } from 'react-hot-toast';
import SignatureCanvas from "react-signature-canvas";

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

const AgreementSign: React.FC = () => {
  const [agreements, setAgreements] = useState<AgreementData[]>([]);
  const [selectedAgreement, setSelectedAgreement] = useState<AgreementData | null>(null);
  const [signingAs, setSigningAs] = useState<"party1" | "party2" | null>(null);
  const [signatureVisible, setSignatureVisible] = useState(false);
  const sigCanvas = useRef<SignatureCanvas>(null);

  useEffect(() => {
    // 从localStorage加载协议
    const storedAgreements = JSON.parse(localStorage.getItem("agreements") || "[]");
    setAgreements(storedAgreements.filter((a: AgreementData) => a.status === "draft"));
  }, []);

  const handleSelectAgreement = (agreement: AgreementData) => {
    setSelectedAgreement(agreement);
  };

  // 添加父容器引用
const containerRef = useRef(null);

// useEffect(() => {
//   if (containerRef.current && sigCanvas.current) {
//     const canvas = sigCanvas.current.getCanvas();
//     const { clientWidth, clientHeight } = containerRef.current;
//     canvas.width = clientWidth;
//     canvas.height = clientHeight;
//     // 可选：调整线条粗细参数
//     sigCanvas.current.minWidth = 0.5;
//     sigCanvas.current.maxWidth = 1.5;
//   }
// }, []);

  const handleSignAs = (party: "party1" | "party2") => {
    setSigningAs(party);
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
    setSignatureVisible(true);
  };

  const handleClearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  const handleSaveSignature = () => {
    if (!sigCanvas.current || !selectedAgreement || !signingAs) {
      setSignatureVisible(false);
      return;
    }

    if (sigCanvas.current.isEmpty()) {
      toast.error("请先签名");
      return;
    }

    // 获取签名的数据URL
    const signatureDataUrl = sigCanvas.current.toDataURL("image/png");

    // 创建协议更新副本
    const agreementIndex = agreements.findIndex(a => a.id === selectedAgreement.id);
    if (agreementIndex === -1) return;
    
    const updatedAgreement = { ...agreements[agreementIndex] };
    if (!updatedAgreement.signatures) {
      updatedAgreement.signatures = {};
    }
    
    // 更新签名
    updatedAgreement.signatures[signingAs] = signatureDataUrl;
    
    // 检查是否双方都已签名
    if (updatedAgreement.signatures.party1 && updatedAgreement.signatures.party2) {
      updatedAgreement.status = "signed";
    }
    
    // 更新状态
    const updatedAgreements = [...agreements];
    updatedAgreements[agreementIndex] = updatedAgreement;
    
    // 更新所有协议
    const allAgreements = JSON.parse(localStorage.getItem("agreements") || "[]");
    const allAgreementIndex = allAgreements.findIndex((a: AgreementData) => a.id === selectedAgreement.id);
    if (allAgreementIndex !== -1) {
      allAgreements[allAgreementIndex] = updatedAgreement;
      localStorage.setItem("agreements", JSON.stringify(allAgreements));
    }
    
    // 更新UI状态
    setSelectedAgreement(updatedAgreement);
    setAgreements(updatedAgreements.filter(a => a.status === "draft"));
    toast.success("签名成功");
    setSignatureVisible(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">签署同意协议</h2>

      {agreements.length === 0 ? (
        <div className="text-center py-8">暂无待签署的协议</div>
      ) : selectedAgreement ? (
        <div>
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h3 className="text-xl font-semibold mb-2">{selectedAgreement.title}</h3>
            <p className="mb-1">
              <span className="font-medium">甲方：</span> {selectedAgreement.parties.party1}
              {selectedAgreement.signatures?.party1 && " (已签名)"}
            </p>
            <p className="mb-1">
              <span className="font-medium">乙方：</span> {selectedAgreement.parties.party2}
              {selectedAgreement.signatures?.party2 && " (已签名)"}
            </p>
            <div
              className="border border-gray-200 p-2 my-2 text-left whitespace-pre-wrap max-h-[400px] overflow-y-auto"
            >
              {selectedAgreement.content}
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <button
                className={`px-4 py-2 rounded ${selectedAgreement.signatures?.party1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                disabled={!!selectedAgreement.signatures?.party1}
                onClick={() => handleSignAs("party1")}
              >
                {selectedAgreement.signatures?.party1 ? "甲方已签名" : "甲方签名"}
              </button>
              <button
                className={`px-4 py-2 rounded ${selectedAgreement.signatures?.party2 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                disabled={!!selectedAgreement.signatures?.party2}
                onClick={() => handleSignAs("party2")}
              >
                {selectedAgreement.signatures?.party2 ? "乙方已签名" : "乙方签名"}
              </button>
              <button 
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                onClick={() => setSelectedAgreement(null)}
              >
                返回列表
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2 mt-4">
          <h3 className="text-lg font-medium px-2">选择需要签署的协议</h3>
          {agreements.map((agreement) => (
            <div 
              key={agreement.id}
              className="p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleSelectAgreement(agreement)}
            >
              <div className="font-medium">{agreement.title}</div>
              <div className="text-xs text-gray-500">
                创建于: {new Date(agreement.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

{signatureVisible && (
  <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">{`${signingAs === "party1" ? "甲方" : "乙方"}签名`}</h3>
      </div>
      
      {/* 签名区域 */}
      <div className="p-4">
        <div 
          ref={containerRef}
          className="border border-gray-300 rounded-md h-48 w-full bg-white relative"
          style={{ boxSizing: 'border-box' }}
        >
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              className: "signature-canvas",
              style: { 
                width: '100%',
                height: '100%',
                display: 'block',
              }
            }}
            penColor="#555"
            minWidth={0.5}
            maxWidth={1.5}
            backgroundColor="white"
            velocityFilterWeight={0.7}
          />
        </div>
        <div className="flex justify-center mt-3">
          <button 
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={handleClearSignature}
          >
            清除签名
          </button>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="flex justify-end p-4 bg-gray-50 border-t border-gray-200 gap-3">
        <button 
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
          onClick={() => {
            setSignatureVisible(false);
            sigCanvas.current?.clear();
          }}
        >
          取消
        </button>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          onClick={handleSaveSignature}
        >
          确认签名
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AgreementSign;
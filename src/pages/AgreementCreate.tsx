import React, { useState } from "react";
import { toast } from 'react-hot-toast';
import Footer from "../components/Footer";

interface AgreementData {
  id: string;
  title: string;
  parties: {
    party1: string;
    party1Id: string;
    party2: string;
    party2Id: string;
  };
  content: string;
  createdAt: string;
  status: "draft" | "signed";
}

const AgreementCreate: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    party1: '',
    party1Id: '',
    party2: '',
    party2Id: '',
    content: ''
  });
  const [templateSelected, setTemplateSelected] = useState<string | null>(null);

  const templates = [
    {
      id: "template1",
      title: "标准协议",
      content: `鉴于双方均为具有完全民事行为能力的成年人，现就双方自愿参与的亲密和/或性行为达成如下协议：

第一条 双方声明
1.1 双方确认已年满18周岁，具有完全民事行为能力；
1.2 双方确认参与行为完全出于自愿，不存在任何胁迫、欺诈情形；
1.3 双方确认在签订本协议时神志清醒，未受任何药物、酒精等物质影响；
1.4 双方确认已充分了解并接受相关行为可能带来的风险。

第二条 行为规范
2.1 双方应遵守法律法规及公序良俗；
2.2 双方应确保行为安全，采取必要防护措施；
2.3 双方应尊重彼此意愿，不得实施任何强迫行为。

第三条 其他
3.1 本协议自双方签字之日起生效；
3.2 本协议一式两份，双方各执一份，具有同等法律效力。`,
    },
    {
      id: "template2",
      title: "详细协议",
      content: `鉴于双方均为具有完全民事行为能力的成年人，现就双方自愿参与的亲密和/或性行为达成如下协议：

第一条 双方基本信息
1.1 甲方确认已年满18周岁，身份证号码真实有效；
1.2 乙方确认已年满18周岁，身份证号码真实有效；
1.3 双方承诺提供的信息真实、准确、完整。

第二条 行为确认
2.1 双方确认参与行为完全出于自愿；
2.2 双方确认签订本协议时神志清醒，未受任何物质影响；
2.3 双方确认已充分了解行为性质及可能风险。

第三条 行为规范
3.1 双方应确保行为安全，采取必要防护措施；
3.2 双方应尊重彼此身体自主权，明确行为界限；
3.3 双方应保持沟通，及时表达意愿变化。

第四条 健康声明
4.1 双方确认无传染性疾病；
4.2 双方确认无精神障碍或其他可能影响判断力的疾病；
4.3 双方承诺如实告知相关健康状况。

第五条 其他
5.1 本协议自双方签字之日起生效；
5.2 本协议一式两份，双方各执一份。`,
    },
    {
      id: "template3",
      title: "简约协议",
      content: `本协议由双方自愿签订，确认以下事项：

1. 双方均为完全民事行为能力人；
2. 双方自愿参与亲密行为；
3. 双方尊重彼此意愿，可随时终止行为；
4. 本协议自签字之日起生效。`,
    },
    {
      id: "template4",
      title: "健康协议",
      content: `双方确认：

1. 双方均无传染性疾病；
2. 双方已采取必要防护措施；
3. 双方承诺如实告知健康状况；
4. 本协议自签字之日起生效。`,
    },
    {
      id: "template5",
      title: "隐私协议",
      content: `双方约定：

1. 双方尊重彼此隐私权；
2. 未经同意不得拍摄或传播相关内容；
3. 违反约定需承担法律责任；
4. 本协议自签字之日起生效。`,
    },
  ];

  const selectTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setTemplateSelected(templateId);
      setFormData({
        ...formData,
        title: template.title,
        content: template.content
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.party1 || !formData.party1Id || !formData.party2 || !formData.party2Id || !formData.content) {
      toast.error('请填写所有必填项');
      return;
    }
    
    const formattedContent = formData.content.replace(
      /鉴于双方均为/g,
      `本协议由以下双方于${new Date().toLocaleDateString('zh-CN', {year: 'numeric', month: 'long', day: 'numeric'})}签订：\n\n甲方：${formData.party1}（身份证号：${formData.party1Id}）\n乙方：${formData.party2}（身份证号：${formData.party2Id}）\n\n鉴于双方均为`
    );
    
    const newAgreement: AgreementData = {
      id: Date.now().toString(),
      title: formData.title,
      parties: {
        party1: formData.party1,
        party1Id: formData.party1Id,
        party2: formData.party2,
        party2Id: formData.party2Id,
      },
      content: formattedContent,
      createdAt: new Date().toISOString(),
      status: "draft",
    };

    // 获取现有协议或创建新数组
    const existingAgreements = JSON.parse(localStorage.getItem("agreements") || "[]");
    existingAgreements.push(newAgreement);
    localStorage.setItem("agreements", JSON.stringify(existingAgreements));

    toast.success("协议已创建");

    // 重置表单
    setFormData({
      title: '',
      party1: '',
      party1Id: '',
      party2: '',
      party2Id: '',
      content: ''
    });
    setTemplateSelected(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">创建性行为同意协议</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">选择模板</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => selectTemplate(template.id)}
              className={`p-3 border rounded-md cursor-pointer transition-colors ${templateSelected === template.id ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200'}`}
            >
              <div className="font-medium text-gray-800 text-sm flex items-center">
                {template.title}
                {templateSelected === template.id && (
  <span className="ml-1 w-4 h-4 inline-flex items-center justify-center rounded-full bg-blue-500 text-white">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  </span>
)}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {template.content.split('\n')[0]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">协议标题</label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="请输入协议标题"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">甲方姓名</label>
              <input
                value={formData.party1}
                onChange={(e) => setFormData({...formData, party1: e.target.value})}
                placeholder="请输入甲方姓名"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">甲方身份证号</label>
              <input
                value={formData.party1Id}
                onChange={(e) => setFormData({...formData, party1Id: e.target.value})}
                placeholder="请输入甲方身份证号"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">乙方姓名</label>
              <input
                value={formData.party2}
                onChange={(e) => setFormData({...formData, party2: e.target.value})}
                placeholder="请输入乙方姓名"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">乙方身份证号</label>
              <input
                value={formData.party2Id}
                onChange={(e) => setFormData({...formData, party2Id: e.target.value})}
                placeholder="请输入乙方身份证号"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">协议内容</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="请输入协议内容"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
              maxLength={2000}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            创建协议
          </button>
        </div>
      </form>
      <Footer/>
    </div>
  );
};

export default AgreementCreate;
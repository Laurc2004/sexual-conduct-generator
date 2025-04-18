import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-4 mb-10 mt-2">
      <div className="max-w-3xl mx-auto px-4 text-center text-gray-600 text-sm">
        <div className="mb-2">
          <a 
            href="https://github.com/Laurc2004" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            GitHub: Laurc2004
          </a>
        </div>
        <div className="mb-2">
          © {new Date().getFullYear()} 性行为同意协议生成器 - 版权所有
        </div>
        <div>
          隐私声明：所有数据仅存储在您的浏览器本地，不会收集或上传任何用户隐私信息。
        </div>
      </div>
    </footer>
  );
};

export default Footer;
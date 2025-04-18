import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import AgreementCreate from "./pages/AgreementCreate";
import AgreementSign from "./pages/AgreementSign";
import AgreementManage from "./pages/AgreementManage";

// 自定义图标组件
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const TabBarBottom: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  const setRouteActive = (value: string) => {
    navigate(value);
  };

  const tabs = [
    {
      key: '/create',
      title: '创建协议',
      icon: <EditIcon />,
    },
    {
      key: '/sign',
      title: '签署协议',
      icon: <FileIcon />,
    },
    {
      key: '/manage',
      title: '管理协议',
      icon: <ListIcon />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-200 z-50">
      <div className="flex justify-around py-2">
        {tabs.map(item => (
          <button
            key={item.key}
            onClick={() => setRouteActive(item.key)}
            className={`flex flex-col items-center p-2 ${pathname === item.key ? 'text-blue-500' : 'text-gray-500'}`}
          >
            <div className="text-xl">{item.icon}</div>
            <span className="text-xs mt-1">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div className="content" style={{ 
        flex: 1,
        padding: '1rem',
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        <Routes>
          <Route path="/" element={<AgreementCreate />} />
          <Route path="/create" element={<AgreementCreate />} />
          <Route path="/sign" element={<AgreementSign />} />
          <Route path="/manage" element={<AgreementManage />} />
        </Routes>
      </div>
      
      <TabBarBottom />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App

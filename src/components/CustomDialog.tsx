import React, { useState } from 'react';

type DialogProps = {
  title: string;
  message: string;
  onConfirm: () => void;
};

export const CustomDialog = {
  show: ({ title, message, onConfirm }: DialogProps) => {
    const DialogComponent = () => {
      const [visible, setVisible] = useState(true);

      const handleConfirm = () => {
        onConfirm();
        setVisible(false);
      };

      const handleCancel = () => {
        setVisible(false);
      };

      if (!visible) return null;

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            </div>
            <div className="p-4">
              <p className="text-gray-700">{message}</p>
            </div>
            <div className="flex justify-end p-4 border-t border-gray-200 space-x-2">
              <button 
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={handleCancel}
              >
                取消
              </button>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleConfirm}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      );
    };

    return <DialogComponent />;
  }
};

export default CustomDialog;
import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      {/* {/ Animated Dots /} */}
      <div className="flex space-x-2">
        <div
          className="w-5 h-5 rounded-full"
          style={{
            backgroundColor: '#5EB66E',
            animation: 'bounce 1.2s infinite ease-in-out',
            animationDelay: '0s',
          }}
        ></div>
        <div
          className="w-5 h-5 rounded-full"
          style={{
            backgroundColor: '#5EB66E',
            animation: 'bounce 1.2s infinite ease-in-out',
            animationDelay: '0.2s',
          }}
        ></div>
        <div
          className="w-5 h-5 rounded-full"
          style={{
            backgroundColor: '#5EB66E',
            animation: 'bounce 1.2s infinite ease-in-out',
            animationDelay: '0.4s',
          }}
        ></div>
      </div>
     
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;

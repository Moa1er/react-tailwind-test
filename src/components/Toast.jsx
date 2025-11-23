const Toast = ({ message }) => {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-cyan-400/70 bg-slate-900/90 px-4 py-2 text-sm text-cyan-100 shadow-lg shadow-cyan-500/30">
      {message}
    </div>
  );
};

export default Toast;

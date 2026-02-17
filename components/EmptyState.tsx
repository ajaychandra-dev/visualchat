
export default function EmptyState() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pb-40 p-8 pointer-events-none z-10 selection:bg-node-selected/20">
      <div className="max-w-4xl text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both pointer-events-auto">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
          Chat at the speed of <span className="font-serif italic font-light tracking-wide text-blue-100">thought</span>.
        </h1>
        <p className="text-xl text-placeholder max-w-3xl mx-auto leading-relaxed">
          Transform linear conversations into a dynamic logic graph. Map your thoughts and visualize connections in a modular workspace.
        </p>
      </div>
    </div>
  );
}

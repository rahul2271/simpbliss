// Shared frame for text-led pages (FAQ, shipping, policies)
export default function PageShell({ title, intro, children }) {
  return (
    <div className="bg-[#F9F7FA] min-h-screen pt-[120px] md:pt-[170px]">
      <div className="max-w-[860px] mx-auto px-6 md:px-12 pb-28 md:pb-40">
        <header className="text-center mb-16 md:mb-24 flex flex-col items-center">
          <h1 className="font-serif text-5xl md:text-7xl leading-[1] tracking-tight text-[#15091C]">{title}</h1>
          {intro && (
            <p className="mt-8 max-w-xl text-[15px] font-light text-[#15091C]/65 leading-[1.9]">{intro}</p>
          )}
          <div className="w-px h-14 md:h-20 bg-gradient-to-b from-[#C8A97E]/60 to-transparent mt-10" />
        </header>
        {children}
      </div>
    </div>
  );
}

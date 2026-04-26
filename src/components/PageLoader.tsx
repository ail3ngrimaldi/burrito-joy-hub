import burritoCharacter from "@/assets/burrito-character.png";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Burrito with progressive bite animation */}
        <div className="relative w-32 h-32 burrito-bite-container">
          <img
            src={burritoCharacter}
            alt=""
            className="w-full h-full object-contain animate-burrito-wiggle"
            draggable={false}
          />
        </div>

        {/* Crumbs falling */}
        <span className="crumb crumb-1" />
        <span className="crumb crumb-2" />
        <span className="crumb crumb-3" />
      </div>

      <p className="mt-6 text-sm tracking-[0.3em] uppercase text-muted-foreground font-medium animate-pulse">
        Cargando
      </p>
    </div>
  );
};

export default PageLoader;

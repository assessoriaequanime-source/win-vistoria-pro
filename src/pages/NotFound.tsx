import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
      <div className="text-center max-w-sm md:max-w-md">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-6 border border-destructive/20">
          <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-destructive" />
        </div>
        <h1 className="font-display font-bold text-6xl md:text-7xl text-foreground mb-3">404</h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-4">Página não encontrada</p>
        <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link to="/">
          <Button className="touch-button bg-primary text-primary-foreground font-semibold h-11">
            <Home className="w-5 h-5 mr-2" />
            Voltar ao Início
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

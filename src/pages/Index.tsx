
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
      <div className="text-center max-w-md px-4">
        <h1 className="text-5xl font-bold mb-6 text-pink-400">Клоуны и Алмазы</h1>
        <p className="text-xl mb-8">Увлекательная игра, где добрые клоуны помогают собирать волшебные алмазы!</p>
        
        <div className="mb-8 flex justify-center gap-4">
          <div className="text-6xl animate-bounce">🤡</div>
          <div className="text-6xl animate-pulse">💎</div>
        </div>
        
        <Link to="/space-game">
          <Button className="bg-pink-600 hover:bg-pink-700 text-lg px-8 py-6 h-auto">
            <Icon name="Gem" fallback="Diamond" className="mr-2" size={20} />
            Играть сейчас
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;

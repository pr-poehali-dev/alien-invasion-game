
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center max-w-md px-4">
        <h1 className="text-5xl font-bold mb-6 text-blue-400">Космическая Защита</h1>
        <p className="text-xl mb-8">Захватывающая игра где вы защищаете Землю от инопланетных захватчиков!</p>
        
        <div className="mb-8 flex justify-center">
          <div className="text-6xl animate-pulse">👾</div>
        </div>
        
        <Link to="/space-game">
          <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 h-auto">
            <Icon name="Rocket" size={20} />
            Играть сейчас
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;

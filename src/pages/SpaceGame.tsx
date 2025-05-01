
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useIsMobile } from "@/hooks/use-mobile";

interface Clown {
  id: number;
  x: number;
  y: number;
  speed: number;
  value: number;
  happy?: boolean;
}

interface Diamond {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

const SpaceGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [player, setPlayer] = useState({ x: 50 });
  const [clowns, setClowns] = useState<Clown[]>([]);
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Инициализация игры
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setPlayer({ x: 50 });
    setClowns([]);
    setDiamonds([]);
    setGameOver(false);
  };

  // Перемещение игрока
  const movePlayer = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!gameStarted || gameOver) return;
    
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;
    
    const rect = gameArea.getBoundingClientRect();
    let clientX;
    
    if ('touches' in e) {
      // Сенсорное событие
      clientX = e.touches[0].clientX;
    } else {
      // Событие мыши
      clientX = e.clientX;
    }
    
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPlayer({ x: Math.max(5, Math.min(95, x)) });
  };

  // Создание алмаза
  const createDiamond = () => {
    if (!gameStarted || gameOver) return;
    
    const newDiamond = {
      id: Date.now(),
      x: Math.random() * 90 + 5,
      y: 0,
      collected: false
    };
    
    setDiamonds(prev => [...prev, newDiamond]);
  };

  // Создание клоунов
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const interval = setInterval(() => {
      const newClown = {
        id: Date.now(),
        x: Math.random() * 90 + 5,
        y: 0,
        speed: Math.random() * 0.2 + 0.1,
        value: Math.floor(Math.random() * 3) + 1
      };
      
      setClowns(prev => [...prev, newClown]);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  // Создание алмазов
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const interval = setInterval(createDiamond, 3000);
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  // Игровой цикл
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const gameLoop = setInterval(() => {
      // Движение алмазов
      setDiamonds(prev => 
        prev
          .map(diamond => ({ ...diamond, y: diamond.y + 0.5 }))
          .filter(diamond => diamond.y < 100 && !diamond.collected)
      );
      
      // Движение клоунов
      setClowns(prev => {
        const updated = prev
          .map(clown => ({ ...clown, y: clown.y + clown.speed }))
          .filter(clown => clown.y < 100);
          
        // Проверка на проигрыш (время вышло)
        if (updated.length > 20) {
          setGameOver(true);
        }
        
        return updated;
      });
      
      // Проверка сбора алмазов
      setDiamonds(prev => {
        const updatedDiamonds = [...prev];
        let collected = false;
        
        for (let i = updatedDiamonds.length - 1; i >= 0; i--) {
          if (
            Math.abs(updatedDiamonds[i].x - player.x) < 8 &&
            updatedDiamonds[i].y > 85 &&
            !updatedDiamonds[i].collected
          ) {
            setScore(s => s + 10);
            updatedDiamonds[i].collected = true;
            collected = true;
            
            // Сделаем клоунов радостными, когда собираем алмаз
            if (collected) {
              setClowns(prevClowns => 
                prevClowns.map(clown => ({
                  ...clown,
                  happy: true
                }))
              );
              
              // Вернем клоунов в нормальное состояние через секунду
              setTimeout(() => {
                setClowns(prevClowns => 
                  prevClowns.map(clown => ({
                    ...clown,
                    happy: false
                  }))
                );
              }, 1000);
            }
          }
        }
        
        return updatedDiamonds.filter(d => !d.collected);
      });
    }, 50);
    
    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, player.x]);

  // Эффект для блокировки прокрутки страницы на мобильных устройствах
  useEffect(() => {
    if (gameStarted && isMobile) {
      document.body.style.overflow = 'hidden';
      
      // Установка высоты и ширины экрана для игрового поля
      if (gameAreaRef.current) {
        const gameArea = gameAreaRef.current;
        
        // Включаем полноэкранный режим на мобильных устройствах
        if (document.documentElement.requestFullscreen && isMobile) {
          document.documentElement.requestFullscreen().catch(err => {
            console.log("Ошибка перехода в полноэкранный режим:", err);
          });
        }
      }
      
      return () => {
        document.body.style.overflow = '';
        
        // Выход из полноэкранного режима при завершении игры
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(err => {
            console.log("Ошибка выхода из полноэкранного режима:", err);
          });
        }
      };
    }
  }, [gameStarted, isMobile]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 to-indigo-900 text-white landscape:h-screen landscape:overflow-hidden">
      <h1 className="text-4xl font-bold mb-4 text-center landscape:text-2xl landscape:mb-1">Клоуны и Алмазы</h1>
      
      {!gameStarted ? (
        <div className="text-center">
          <p className="text-xl mb-6 landscape:text-lg landscape:mb-2">Собирайте алмазы с помощью добрых клоунов!</p>
          <Button onClick={startGame} className="bg-pink-600 hover:bg-pink-700">
            <Icon name="Gem" fallback="Diamond" className="mr-2" />
            Начать игру
          </Button>
          {isMobile && (
            <p className="mt-4 text-sm text-gray-300">
              Рекомендуется играть в горизонтальном режиме
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between w-full max-w-lg px-4 landscape:mb-1">
            <div className="font-bold">Алмазы: {score}</div>
            <Button variant="outline" onClick={startGame} size="sm">
              Сбросить
            </Button>
          </div>
          
          <div 
            ref={gameAreaRef}
            className="w-full max-w-lg h-[500px] bg-gradient-to-b from-indigo-800 to-purple-800 relative border border-pink-500 overflow-hidden rounded-lg landscape:h-[calc(100vh-100px)]"
            onMouseMove={movePlayer}
            onTouchMove={movePlayer}
          >
            {gameOver ? (
              <div className="absolute inset-0 flex items-center justify-center flex-col bg-black bg-opacity-70">
                <div className="text-2xl font-bold mb-4">Игра окончена!</div>
                <div className="text-xl mb-6">Собрано алмазов: {score}</div>
                <Button onClick={startGame} className="bg-pink-600 hover:bg-pink-700">Играть снова</Button>
              </div>
            ) : null}
            
            {/* Корзинка игрока */}
            <div 
              className="absolute bottom-2 w-12 h-12 transform -translate-x-1/2"
              style={{ left: `${player.x}%` }}
            >
              <div className="w-12 h-8 border-2 border-yellow-400 rounded-b-md bg-yellow-300 bg-opacity-50"></div>
            </div>
            
            {/* Алмазы */}
            {diamonds.map(diamond => (
              <div
                key={diamond.id}
                className="absolute w-6 h-6 text-blue-400"
                style={{ left: `${diamond.x}%`, top: `${diamond.y}%` }}
              >
                <div className="animate-pulse">💎</div>
              </div>
            ))}
            
            {/* Клоуны */}
            {clowns.map(clown => (
              <div
                key={clown.id}
                className={`absolute w-10 h-10 ${clown.happy ? 'animate-bounce' : 'animate-pulse'}`}
                style={{ left: `${clown.x}%`, top: `${clown.y}%` }}
              >
                <div>🤡</div>
                {clown.value > 1 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {clown.value}
                  </span>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-300 landscape:mt-1">
            {isMobile ? 
              "Перемещайте палец для управления корзинкой. Ловите падающие алмазы!" :
              "Перемещайте мышь для управления корзинкой. Ловите падающие алмазы!"
            }
          </div>
        </>
      )}
    </div>
  );
};

export default SpaceGame;

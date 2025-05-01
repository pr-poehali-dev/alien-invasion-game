
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface Alien {
  id: number;
  x: number;
  y: number;
  speed: number;
}

interface Laser {
  id: number;
  x: number;
  y: number;
}

const SpaceGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [player, setPlayer] = useState({ x: 50 });
  const [aliens, setAliens] = useState<Alien[]>([]);
  const [lasers, setLasers] = useState<Laser[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  
  // Инициализация игры
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setPlayer({ x: 50 });
    setAliens([]);
    setLasers([]);
    setGameOver(false);
  };

  // Перемещение игрока
  const movePlayer = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameStarted || gameOver) return;
    
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;
    
    const rect = gameArea.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setPlayer({ x: Math.max(5, Math.min(95, x)) });
  };

  // Стрельба
  const shoot = () => {
    if (!gameStarted || gameOver) return;
    
    const newLaser = {
      id: Date.now(),
      x: player.x,
      y: 90
    };
    
    setLasers(prev => [...prev, newLaser]);
  };

  // Создание инопланетян
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const interval = setInterval(() => {
      const newAlien = {
        id: Date.now(),
        x: Math.random() * 90 + 5,
        y: 0,
        speed: Math.random() * 0.3 + 0.2
      };
      
      setAliens(prev => [...prev, newAlien]);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  // Игровой цикл
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const gameLoop = setInterval(() => {
      // Движение лазеров
      setLasers(prev => 
        prev
          .map(laser => ({ ...laser, y: laser.y - 1 }))
          .filter(laser => laser.y > 0)
      );
      
      // Движение инопланетян
      setAliens(prev => {
        const updated = prev
          .map(alien => ({ ...alien, y: alien.y + alien.speed }))
          .filter(alien => alien.y < 100);
          
        // Проверка на проигрыш (инопланетянин достиг низа)
        if (updated.some(alien => alien.y > 90)) {
          setGameOver(true);
        }
        
        return updated;
      });
      
      // Проверка столкновений
      setAliens(prev => {
        const updatedAliens = [...prev];
        const updatedLasers = [...lasers];
        
        for (let i = updatedAliens.length - 1; i >= 0; i--) {
          for (let j = updatedLasers.length - 1; j >= 0; j--) {
            if (
              Math.abs(updatedAliens[i].x - updatedLasers[j].x) < 5 &&
              Math.abs(updatedAliens[i].y - updatedLasers[j].y) < 3
            ) {
              setScore(s => s + 10);
              updatedAliens.splice(i, 1);
              updatedLasers.splice(j, 1);
              break;
            }
          }
        }
        
        setLasers(updatedLasers);
        return updatedAliens;
      });
    }, 50);
    
    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, lasers]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4 text-center">Космическая Защита</h1>
      
      {!gameStarted ? (
        <div className="text-center">
          <p className="text-xl mb-6">Защитите Землю от инопланетных захватчиков!</p>
          <Button onClick={startGame} className="bg-blue-600 hover:bg-blue-700">
            <Icon name="Rocket" />
            Начать игру
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between w-full max-w-lg px-4">
            <div className="font-bold">Очки: {score}</div>
            <Button variant="outline" onClick={startGame} size="sm">
              Сбросить
            </Button>
          </div>
          
          <div 
            ref={gameAreaRef}
            className="w-full max-w-lg h-[500px] bg-black relative border border-blue-500 overflow-hidden"
            onClick={shoot}
            onMouseMove={movePlayer}
          >
            {gameOver ? (
              <div className="absolute inset-0 flex items-center justify-center flex-col bg-black bg-opacity-70">
                <div className="text-2xl font-bold mb-4">Игра окончена!</div>
                <div className="text-xl mb-6">Ваш счет: {score}</div>
                <Button onClick={startGame}>Играть снова</Button>
              </div>
            ) : null}
            
            {/* Корабль игрока */}
            <div 
              className="absolute bottom-2 w-10 h-10 transform -translate-x-1/2"
              style={{ left: `${player.x}%` }}
            >
              <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] mx-auto border-l-transparent border-r-transparent border-b-blue-500"></div>
            </div>
            
            {/* Лазеры */}
            {lasers.map(laser => (
              <div
                key={laser.id}
                className="absolute w-1 h-4 bg-red-500"
                style={{ left: `${laser.x}%`, bottom: `${100 - laser.y}%` }}
              />
            ))}
            
            {/* Инопланетяне */}
            {aliens.map(alien => (
              <div
                key={alien.id}
                className="absolute w-8 h-8 text-green-500"
                style={{ left: `${alien.x}%`, top: `${alien.y}%` }}
              >
                <div className="animate-pulse">👾</div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-400">
            Нажмите на игровое поле для стрельбы. Перемещайте мышь для управления кораблем.
          </div>
        </>
      )}
    </div>
  );
};

export default SpaceGame;

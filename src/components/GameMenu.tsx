import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';

interface GameMenuProps {
  onStartDisassembly: () => void;
  onStartShooter: () => void;
  onStartVR: () => void;
}

export default function GameMenu({ onStartDisassembly, onStartShooter, onStartVR }: GameMenuProps) {
  const [playerLevel] = useState(5);
  const [playerXP] = useState(350);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent">
            DISASSEMBLY 3D
          </h1>
          <p className="text-muted-foreground text-lg">Разбирай. Стреляй. Доминируй.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card 
            className="group relative overflow-hidden cursor-pointer hover-scale border-2 border-primary/20 hover:border-primary transition-all duration-300"
            onClick={onStartDisassembly}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="p-8 relative z-10">
              <div className="mb-4 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon name="Wrench" size={40} className="text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center mb-3">Разборка</h3>
              <p className="text-muted-foreground text-center text-sm">
                Разбирай сложные механизмы на части с реалистичной физикой
              </p>
              <div className="mt-6 flex justify-center gap-2">
                <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
              </div>
            </div>
          </Card>

          <Card 
            className="group relative overflow-hidden cursor-pointer hover-scale border-2 border-destructive/20 hover:border-destructive transition-all duration-300"
            onClick={onStartShooter}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="p-8 relative z-10">
              <div className="mb-4 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon name="Crosshair" size={40} className="text-destructive" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center mb-3">Шутер</h3>
              <p className="text-muted-foreground text-center text-sm">
                Стреляй по мишеням из пистолетов, автоматов и используй бомбы
              </p>
              <div className="mt-6 flex justify-center gap-2">
                <Icon name="Target" size={16} className="text-destructive" />
                <Icon name="Zap" size={16} className="text-destructive" />
                <Icon name="Bomb" size={16} className="text-destructive" />
              </div>
            </div>
          </Card>

          <Card 
            className="group relative overflow-hidden cursor-pointer hover-scale border-2 border-secondary/20 hover:border-secondary transition-all duration-300"
            onClick={onStartVR}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="p-8 relative z-10">
              <div className="mb-4 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon name="Glasses" size={40} className="text-secondary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center mb-3">VR Режим</h3>
              <p className="text-muted-foreground text-center text-sm">
                Погрузись в виртуальную реальность для максимального эффекта
              </p>
              <div className="mt-6 flex justify-center">
                <span className="text-xs bg-secondary/20 px-3 py-1 rounded-full text-secondary font-semibold">
                  СКОРО
                </span>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 border-2 border-primary/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon name="User" size={24} className="text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Игрок</h4>
                <p className="text-sm text-muted-foreground">Уровень {playerLevel}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Опыт</p>
              <p className="font-bold text-primary">{playerXP} / 500 XP</p>
            </div>
          </div>
          <Progress value={(playerXP / 500) * 100} className="h-3" />
        </Card>
      </div>
    </div>
  );
}

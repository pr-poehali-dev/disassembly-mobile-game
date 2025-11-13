import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';

interface Target {
  id: number;
  x: number;
  y: number;
  hit: boolean;
  size: number;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
}

interface ShooterModeProps {
  onBack: () => void;
}

export default function ShooterMode({ onBack }: ShooterModeProps) {
  const [weapon, setWeapon] = useState<'pistol' | 'rifle' | 'bomb'>('pistol');
  const [targets, setTargets] = useState<Target[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [score, setScore] = useState(0);
  const [ammo, setAmmo] = useState(30);
  const [timeLeft, setTimeLeft] = useState(90);
  const [crosshairPos, setCrosshairPos] = useState({ x: 50, y: 50 });
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const bulletIdRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const spawnTarget = () => {
      if (targets.length < 8) {
        const newTarget: Target = {
          id: Date.now() + Math.random(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 70 + 15,
          hit: false,
          size: Math.random() * 30 + 40,
        };
        setTargets((prev) => [...prev, newTarget]);
      }
    };

    const interval = setInterval(spawnTarget, 2000);
    spawnTarget();
    return () => clearInterval(interval);
  }, [targets.length]);

  useEffect(() => {
    const moveBullets = setInterval(() => {
      setBullets((prevBullets) => {
        const moved = prevBullets.map((bullet) => ({
          ...bullet,
          y: bullet.y - 5,
        }));
        return moved.filter((bullet) => bullet.y > 0);
      });
    }, 50);
    return () => clearInterval(moveBullets);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setCrosshairPos({ x, y });
    }
  };

  const handleShoot = (e: React.MouseEvent) => {
    if (ammo <= 0) return;

    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    if (weapon === 'bomb') {
      const bombRadius = 20;
      setTargets((prevTargets) =>
        prevTargets.map((target) => {
          const distance = Math.sqrt(
            Math.pow(target.x - clickX, 2) + Math.pow(target.y - clickY, 2)
          );
          if (distance < bombRadius && !target.hit) {
            setScore((prev) => prev + 500);
            return { ...target, hit: true };
          }
          return target;
        })
      );
      setAmmo((prev) => prev - 10);
    } else {
      const newBullet: Bullet = {
        id: bulletIdRef.current++,
        x: clickX,
        y: clickY,
      };
      setBullets((prev) => [...prev, newBullet]);

      setTargets((prevTargets) =>
        prevTargets.map((target) => {
          const hitRange = target.size / 10;
          if (
            Math.abs(target.x - clickX) < hitRange &&
            Math.abs(target.y - clickY) < hitRange &&
            !target.hit
          ) {
            const points = weapon === 'rifle' ? 200 : 100;
            setScore((prev) => prev + points);
            return { ...target, hit: true };
          }
          return target;
        })
      );
      setAmmo((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const cleanup = setInterval(() => {
      setTargets((prev) => prev.filter((t) => !t.hit));
    }, 500);
    return () => clearInterval(cleanup);
  }, []);

  const getWeaponIcon = () => {
    switch (weapon) {
      case 'pistol': return 'Sword';
      case 'rifle': return 'Zap';
      case 'bomb': return 'Bomb';
    }
  };

  const getWeaponName = () => {
    switch (weapon) {
      case 'pistol': return 'Пистолет';
      case 'rifle': return 'Автомат';
      case 'bomb': return 'Бомба';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="gap-2">
            <Icon name="ArrowLeft" size={20} />
            Назад
          </Button>
          <div className="flex gap-4">
            <Card className="px-6 py-3 bg-card/50 backdrop-blur">
              <div className="flex items-center gap-3">
                <Icon name="Target" className="text-destructive" size={24} />
                <div>
                  <p className="text-xs text-muted-foreground">Очки</p>
                  <p className="text-xl font-bold">{score}</p>
                </div>
              </div>
            </Card>
            <Card className="px-6 py-3 bg-card/50 backdrop-blur">
              <div className="flex items-center gap-3">
                <Icon name="Crosshair" className="text-primary" size={24} />
                <div>
                  <p className="text-xs text-muted-foreground">Патроны</p>
                  <p className="text-xl font-bold">{ammo}</p>
                </div>
              </div>
            </Card>
            <Card className="px-6 py-3 bg-card/50 backdrop-blur">
              <div className="flex items-center gap-3">
                <Icon name="Clock" className="text-secondary" size={24} />
                <div>
                  <p className="text-xs text-muted-foreground">Время</p>
                  <p className="text-xl font-bold">{timeLeft}s</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-4 border-2 border-destructive/20">
              <div
                ref={gameAreaRef}
                className="relative w-full aspect-video bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg overflow-hidden cursor-crosshair"
                onMouseMove={handleMouseMove}
                onClick={handleShoot}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_70%)]" />

                {targets.map((target) => (
                  <div
                    key={target.id}
                    className={`absolute transition-all duration-300 ${
                      target.hit ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                    }`}
                    style={{
                      left: `${target.x}%`,
                      top: `${target.y}%`,
                      width: `${target.size}px`,
                      height: `${target.size}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 rounded-full bg-destructive/20 border-4 border-destructive animate-pulse" />
                      <div className="absolute inset-2 rounded-full bg-destructive/40 border-2 border-destructive" />
                      <div className="absolute inset-4 rounded-full bg-destructive/60" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Icon name="Target" size={target.size / 3} className="text-destructive" />
                      </div>
                    </div>
                  </div>
                ))}

                {bullets.map((bullet) => (
                  <div
                    key={bullet.id}
                    className="absolute w-2 h-4 bg-yellow-400 rounded-full shadow-lg"
                    style={{
                      left: `${bullet.x}%`,
                      top: `${bullet.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ))}

                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: `${crosshairPos.x}%`,
                    top: `${crosshairPos.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <Icon name="Crosshair" size={32} className="text-primary drop-shadow-lg" />
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Боеприпасы</span>
                  <span className="text-sm text-muted-foreground">{ammo} / 30</span>
                </div>
                <Progress value={(ammo / 30) * 100} className="h-3" />
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-6 border-2 border-destructive/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Icon name="Layers" className="text-destructive" size={24} />
                Оружие
              </h3>
              <div className="space-y-3">
                <Button
                  onClick={() => setWeapon('pistol')}
                  variant={weapon === 'pistol' ? 'default' : 'outline'}
                  className="w-full justify-start gap-3 h-auto py-4"
                >
                  <Icon name="Sword" size={24} />
                  <div className="text-left">
                    <p className="font-bold">Пистолет</p>
                    <p className="text-xs text-muted-foreground">+100 очков, 1 патрон</p>
                  </div>
                </Button>
                <Button
                  onClick={() => setWeapon('rifle')}
                  variant={weapon === 'rifle' ? 'default' : 'outline'}
                  className="w-full justify-start gap-3 h-auto py-4"
                >
                  <Icon name="Zap" size={24} />
                  <div className="text-left">
                    <p className="font-bold">Автомат</p>
                    <p className="text-xs text-muted-foreground">+200 очков, 1 патрон</p>
                  </div>
                </Button>
                <Button
                  onClick={() => setWeapon('bomb')}
                  variant={weapon === 'bomb' ? 'default' : 'outline'}
                  className="w-full justify-start gap-3 h-auto py-4"
                >
                  <Icon name="Bomb" size={24} />
                  <div className="text-left">
                    <p className="font-bold">Бомба</p>
                    <p className="text-xs text-muted-foreground">Взрыв, 10 патронов</p>
                  </div>
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-destructive/10 to-transparent border-2 border-destructive/20">
              <h3 className="text-lg font-bold mb-3 text-destructive flex items-center gap-2">
                <Icon name={getWeaponIcon()} size={20} />
                {getWeaponName()}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {weapon === 'pistol' && 'Точное оружие для меткой стрельбы. Наводись и стреляй!'}
                {weapon === 'rifle' && 'Мощный автомат с высоким уроном. Быстрая стрельба!'}
                {weapon === 'bomb' && 'Взрывает всё в радиусе. Используй с умом!'}
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Урон:</span>
                  <span className="font-bold">
                    {weapon === 'pistol' ? '★★☆☆☆' : weapon === 'rifle' ? '★★★★☆' : '★★★★★'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Скорострельность:</span>
                  <span className="font-bold">
                    {weapon === 'pistol' ? '★★★☆☆' : weapon === 'rifle' ? '★★★★★' : '★☆☆☆☆'}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-primary/20">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Icon name="Info" className="text-primary" size={20} />
                Управление
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Icon name="Mouse" size={16} className="text-primary" />
                  Наведи курсор на цель
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="MousePointerClick" size={16} className="text-primary" />
                  Нажми для выстрела
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Target" size={16} className="text-primary" />
                  Попадай в цели для очков
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';

interface Part {
  id: number;
  x: number;
  y: number;
  rotation: number;
  removed: boolean;
  type: 'screw' | 'panel' | 'battery' | 'chip' | 'wire';
}

interface DisassemblyModeProps {
  onBack: () => void;
}

export default function DisassemblyMode({ onBack }: DisassemblyModeProps) {
  const [parts, setParts] = useState<Part[]>([
    { id: 1, x: 50, y: 30, rotation: 0, removed: false, type: 'screw' },
    { id: 2, x: 70, y: 30, rotation: 0, removed: false, type: 'screw' },
    { id: 3, x: 50, y: 70, rotation: 0, removed: false, type: 'screw' },
    { id: 4, x: 70, y: 70, rotation: 0, removed: false, type: 'screw' },
    { id: 5, x: 60, y: 50, rotation: 0, removed: false, type: 'panel' },
    { id: 6, x: 55, y: 55, rotation: 0, removed: false, type: 'battery' },
    { id: 7, x: 65, y: 55, rotation: 0, removed: false, type: 'chip' },
    { id: 8, x: 60, y: 45, rotation: 0, removed: false, type: 'wire' },
  ]);
  
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [draggedPart, setDraggedPart] = useState<number | null>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePartClick = (partId: number) => {
    setParts((prevParts) =>
      prevParts.map((part) => {
        if (part.id === partId && !part.removed) {
          const canRemove = part.type === 'screw' || 
            (part.type === 'panel' && prevParts.filter(p => p.type === 'screw' && !p.removed).length === 0) ||
            (part.type !== 'screw' && part.type !== 'panel' && prevParts.find(p => p.id === 5)?.removed);
          
          if (canRemove) {
            setScore((prev) => prev + 100);
            return { ...part, removed: true, x: part.x + 20, y: part.y - 30, rotation: part.rotation + 180 };
          }
        }
        return part;
      })
    );
  };

  const handleMouseDown = (partId: number) => {
    setDraggedPart(partId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedPart !== null && gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setParts((prevParts) =>
        prevParts.map((part) =>
          part.id === draggedPart ? { ...part, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) } : part
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggedPart(null);
  };

  const progress = (parts.filter((p) => p.removed).length / parts.length) * 100;

  const getPartIcon = (type: string) => {
    switch (type) {
      case 'screw': return 'Circle';
      case 'panel': return 'Square';
      case 'battery': return 'Battery';
      case 'chip': return 'Cpu';
      case 'wire': return 'Cable';
      default: return 'Circle';
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
          <div className="flex gap-6">
            <Card className="px-6 py-3 bg-card/50 backdrop-blur">
              <div className="flex items-center gap-3">
                <Icon name="Trophy" className="text-yellow-500" size={24} />
                <div>
                  <p className="text-xs text-muted-foreground">Очки</p>
                  <p className="text-xl font-bold">{score}</p>
                </div>
              </div>
            </Card>
            <Card className="px-6 py-3 bg-card/50 backdrop-blur">
              <div className="flex items-center gap-3">
                <Icon name="Clock" className="text-primary" size={24} />
                <div>
                  <p className="text-xs text-muted-foreground">Время</p>
                  <p className="text-xl font-bold">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-8 border-2 border-primary/20">
              <div 
                ref={gameAreaRef}
                className="relative w-full aspect-square bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg overflow-hidden cursor-pointer"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(155,135,245,0.1),transparent_70%)]" />
                
                {parts.map((part) => (
                  <div
                    key={part.id}
                    className={`absolute transition-all duration-300 ${
                      part.removed ? 'opacity-30 pointer-events-none' : 'opacity-100 cursor-grab active:cursor-grabbing'
                    }`}
                    style={{
                      left: `${part.x}%`,
                      top: `${part.y}%`,
                      transform: `translate(-50%, -50%) rotate(${part.rotation}deg)`,
                    }}
                    onClick={() => handlePartClick(part.id)}
                    onMouseDown={() => handleMouseDown(part.id)}
                  >
                    <div className={`
                      w-12 h-12 rounded-lg flex items-center justify-center
                      ${part.type === 'screw' ? 'bg-secondary/40 border-2 border-secondary' : ''}
                      ${part.type === 'panel' ? 'bg-primary/40 border-2 border-primary w-32 h-32' : ''}
                      ${part.type === 'battery' ? 'bg-green-500/40 border-2 border-green-500 w-20 h-10' : ''}
                      ${part.type === 'chip' ? 'bg-blue-500/40 border-2 border-blue-500 w-16 h-16' : ''}
                      ${part.type === 'wire' ? 'bg-yellow-500/40 border-2 border-yellow-500 w-24 h-4' : ''}
                      hover:scale-110 transition-transform shadow-lg backdrop-blur
                    `}>
                      <Icon 
                        name={getPartIcon(part.type)} 
                        size={part.type === 'panel' ? 48 : part.type === 'screw' ? 16 : 24}
                        className={`
                          ${part.type === 'screw' ? 'text-secondary' : ''}
                          ${part.type === 'panel' ? 'text-primary' : ''}
                          ${part.type === 'battery' ? 'text-green-500' : ''}
                          ${part.type === 'chip' ? 'text-blue-500' : ''}
                          ${part.type === 'wire' ? 'text-yellow-500' : ''}
                        `}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Прогресс разборки</span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-6 border-2 border-primary/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Icon name="Info" className="text-primary" size={24} />
                Инструкция
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>Сначала открутите все винты (серые круги)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>Снимите крышку (большой фиолетовый квадрат)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>Извлеките внутренние компоненты</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">4.</span>
                  <span>Перетаскивайте детали для их перемещения</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-2 border-primary/20">
              <h3 className="text-lg font-bold mb-3 text-primary">Легенда деталей</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-secondary/40 border-2 border-secondary flex items-center justify-center">
                    <Icon name="Circle" size={12} className="text-secondary" />
                  </div>
                  <span>Винт</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-primary/40 border-2 border-primary flex items-center justify-center">
                    <Icon name="Square" size={12} className="text-primary" />
                  </div>
                  <span>Крышка</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-green-500/40 border-2 border-green-500 flex items-center justify-center">
                    <Icon name="Battery" size={12} className="text-green-500" />
                  </div>
                  <span>Батарея</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-500/40 border-2 border-blue-500 flex items-center justify-center">
                    <Icon name="Cpu" size={12} className="text-blue-500" />
                  </div>
                  <span>Процессор</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-yellow-500/40 border-2 border-yellow-500 flex items-center justify-center">
                    <Icon name="Cable" size={12} className="text-yellow-500" />
                  </div>
                  <span>Провод</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

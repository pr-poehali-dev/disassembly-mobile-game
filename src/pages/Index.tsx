import { useState } from 'react';
import GameMenu from '@/components/GameMenu';
import DisassemblyMode from '@/components/DisassemblyMode';
import ShooterMode from '@/components/ShooterMode';

type GameMode = 'menu' | 'disassembly' | 'shooter' | 'vr';

export default function Index() {
  const [gameMode, setGameMode] = useState<GameMode>('menu');

  const handleStartDisassembly = () => setGameMode('disassembly');
  const handleStartShooter = () => setGameMode('shooter');
  const handleStartVR = () => {
    alert('VR режим скоро будет доступен! 🥽');
  };
  const handleBackToMenu = () => setGameMode('menu');

  return (
    <div className="min-h-screen">
      {gameMode === 'menu' && (
        <GameMenu
          onStartDisassembly={handleStartDisassembly}
          onStartShooter={handleStartShooter}
          onStartVR={handleStartVR}
        />
      )}
      {gameMode === 'disassembly' && <DisassemblyMode onBack={handleBackToMenu} />}
      {gameMode === 'shooter' && <ShooterMode onBack={handleBackToMenu} />}
    </div>
  );
}

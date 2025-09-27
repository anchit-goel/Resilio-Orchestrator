import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Terminal, Lock, User } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    onLogin();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Terminal-style background pattern */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/20 to-black"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 0, 0.03) 2px,
            rgba(0, 255, 0, 0.03) 4px
          )`
        }}></div>
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* App Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-green-500/20 rounded-full border border-green-500/30">
              <Terminal className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <h1 className="text-green-400 mb-2 font-mono tracking-wider">TERMINAL MANAGER</h1>
          <p className="text-green-300/60 font-mono text-sm">Secure Shell Access</p>
        </div>

        {/* Login Card */}
        <Card className="bg-gray-900/80 border-green-500/30 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-green-400 font-mono text-center">Access Terminal</CardTitle>
            <CardDescription className="text-green-300/60 text-center font-mono text-sm">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-green-300 font-mono">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-green-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="root"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-black/50 border-green-500/30 text-green-300 placeholder-green-400/40 font-mono focus:border-green-400 focus:ring-green-400/20"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-green-300 font-mono">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-green-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-black/50 border-green-500/30 text-green-300 placeholder-green-400/40 font-mono focus:border-green-400 focus:ring-green-400/20"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-500 text-black font-mono mt-6 py-3"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    Connecting...
                  </div>
                ) : (
                  'Connect to Terminal'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-green-400/40 font-mono text-xs">
            v2.1.3 | Secure Connection
          </p>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Terminal, 
  Server, 
  Wifi, 
  Activity, 
  Settings, 
  LogOut, 
  Plus,
  MoreVertical,
  Play,
  Square,
  BarChart3
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { DataDashboard } from './DataDashboard';

interface TerminalManagerProps {
  onLogout: () => void;
}

interface TerminalSession {
  id: string;
  name: string;
  host: string;
  status: 'connected' | 'disconnected' | 'connecting';
  lastActivity: string;
}

export function TerminalManager({ onLogout }: TerminalManagerProps) {
  const [activeTab, setActiveTab] = useState<'sessions' | 'dashboard' | 'servers' | 'monitor'>('sessions');
  const [terminals, setTerminals] = useState<TerminalSession[]>([
    {
      id: '1',
      name: 'Production Server',
      host: '192.168.1.100',
      status: 'connected',
      lastActivity: '2 min ago'
    },
    {
      id: '2',
      name: 'Development Server',
      host: '10.0.0.50',
      status: 'connected',
      lastActivity: '5 min ago'
    },
    {
      id: '3',
      name: 'Database Server',
      host: '192.168.1.200',
      status: 'disconnected',
      lastActivity: '1 hour ago'
    }
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'connecting': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'disconnected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-green-500/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="h-6 w-6 text-green-400" />
            <div>
              <h1 className="text-green-400">Terminal Manager</h1>
              <p className="text-green-300/60 text-sm">{currentTime.toLocaleTimeString()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-500 text-black p-2"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-green-400 hover:bg-green-500/20 p-2"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onLogout}
              className="text-red-400 hover:bg-red-500/20 p-2"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Status Bar */}
      <div className="bg-gray-900/30 border-b border-green-500/20 p-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-green-400" />
              <span className="text-green-300">Online</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-400" />
              <span className="text-green-300">{terminals.filter(t => t.status === 'connected').length} Active</span>
            </div>
          </div>
          <div className="text-green-300/60">
            {terminals.length} Sessions
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'sessions' && (
          <div className="p-4 h-full">
            <div className="mb-4">
              <h2 className="text-green-300 mb-2">Active Sessions</h2>
              <p className="text-green-300/60 text-sm">Manage your terminal connections</p>
            </div>

            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-3">
                {terminals.map((terminal) => (
                  <Card key={terminal.id} className="bg-gray-900/50 border-green-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="relative">
                            <Server className="h-5 w-5 text-green-400" />
                            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(terminal.status)}`}></div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-green-300 truncate">{terminal.name}</h3>
                              <Badge className={`text-xs ${getStatusBadgeColor(terminal.status)}`}>
                                {terminal.status}
                              </Badge>
                            </div>
                            <p className="text-green-400/60 text-sm truncate">{terminal.host}</p>
                            <p className="text-green-300/40 text-xs">{terminal.lastActivity}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {terminal.status === 'connected' ? (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-500 text-black p-2"
                            >
                              <Terminal className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-500/30 text-green-400 hover:bg-green-500/20 p-2"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-green-400 hover:bg-green-500/20 p-2"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-gray-900 border-green-500/30">
                              <DropdownMenuItem className="text-green-300 hover:bg-green-500/20">
                                Connect
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-green-300 hover:bg-green-500/20">
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400 hover:bg-red-500/20">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {activeTab === 'dashboard' && <DataDashboard />}

        {activeTab === 'servers' && (
          <div className="p-4 h-full flex items-center justify-center">
            <div className="text-center">
              <Server className="h-16 w-16 text-green-400/40 mx-auto mb-4" />
              <h3 className="text-green-300 mb-2">Server Management</h3>
              <p className="text-green-400/60 text-sm">Coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'monitor' && (
          <div className="p-4 h-full flex items-center justify-center">
            <div className="text-center">
              <Activity className="h-16 w-16 text-green-400/40 mx-auto mb-4" />
              <h3 className="text-green-300 mb-2">System Monitor</h3>
              <p className="text-green-400/60 text-sm">Real-time monitoring dashboard</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 border-t border-green-500/30 p-4 backdrop-blur-sm">
        <div className="flex justify-around">
          <Button
            variant="ghost"
            onClick={() => setActiveTab('sessions')}
            className={`flex flex-col items-center gap-1 hover:bg-green-500/20 ${
              activeTab === 'sessions' ? 'text-green-400' : 'text-green-400/60'
            }`}
          >
            <Terminal className="h-5 w-5" />
            <span className="text-xs">Sessions</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 hover:bg-green-500/20 ${
              activeTab === 'dashboard' ? 'text-green-400' : 'text-green-400/60'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs">Dashboard</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab('servers')}
            className={`flex flex-col items-center gap-1 hover:bg-green-500/20 ${
              activeTab === 'servers' ? 'text-green-400' : 'text-green-400/60'
            }`}
          >
            <Server className="h-5 w-5" />
            <span className="text-xs">Servers</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab('monitor')}
            className={`flex flex-col items-center gap-1 hover:bg-green-500/20 ${
              activeTab === 'monitor' ? 'text-green-400' : 'text-green-400/60'
            }`}
          >
            <Activity className="h-5 w-5" />
            <span className="text-xs">Monitor</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
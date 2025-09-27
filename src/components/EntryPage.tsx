import React from 'react';
import { Button } from './ui/button';
import { Play, Zap, Shield, BarChart3 } from 'lucide-react';

interface EntryPageProps {
  onStartSimulation: () => void;
}

export function EntryPage({ onStartSimulation }: EntryPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-background to-accent/5 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-primary/30 rounded-lg rotate-12"></div>
        <div className="absolute top-40 right-16 w-24 h-24 border-2 border-accent/30 rounded-lg -rotate-12"></div>
        <div className="absolute bottom-32 left-20 w-28 h-28 border-2 border-primary/30 rounded-lg rotate-45"></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 border-2 border-accent/30 rounded-lg -rotate-45"></div>
      </div>

      {/* Content */}
      <div className="text-center z-10 max-w-sm mx-auto w-full">
        {/* Logo Section */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-red-600 rounded-2xl mb-6 shadow-lg">
            <div className="flex items-center space-x-1">
              <Shield className="h-8 w-8 text-white" />
              <Zap className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-foreground mb-2">Resilient Terminal</h1>
          <h2 className="text-muted-foreground">Orchestrator</h2>
          <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
            AI-powered terminal management with offline analytics and self-service insights
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          <div className="text-center">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Analytics</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Zap className="h-5 w-5 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">AI Insights</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Resilient</p>
          </div>
        </div>

        {/* Start Button */}
        <Button 
          onClick={onStartSimulation}
          size="lg"
          className="w-full bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-white shadow-lg transform transition-all duration-200 hover:scale-105"
        >
          <Play className="h-5 w-5 mr-2" />
          Start Simulation
        </Button>

        <p className="text-xs text-muted-foreground mt-4">
          Honeywell Hackathon • IA1 Terminal Manager
        </p>
      </div>
    </div>
  );
}
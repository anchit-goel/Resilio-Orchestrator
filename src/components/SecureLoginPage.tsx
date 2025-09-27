import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  Shield, 
  Building2,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface SecureLoginPageProps {
  onLoginSuccess: () => void;
}

export function SecureLoginPage({ onLoginSuccess }: SecureLoginPageProps) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Secure credentials validation (in production, this would connect to your authentication service)
  const validateCredentials = (username: string, password: string): boolean => {
    // For demo purposes, accept any username with password length >= 6
    // In production, this would make an API call to your authentication service
    return username.length >= 3 && password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Validate credentials
    const isValidUser = validateCredentials(credentials.username, credentials.password);

    if (isValidUser) {
      // Success - store session info if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rto_remember_user', credentials.username);
        localStorage.setItem('rto_session_token', btoa(`${credentials.username}-${Date.now()}`));
      }
      
      setIsLoading(false);
      onLoginSuccess();
    } else {
      setLoginAttempts(prev => prev + 1);
      setError('Invalid username or password. Please try again.');
      setIsLoading(false);
      
      // Clear password field on failed attempt
      setCredentials(prev => ({ ...prev, password: '' }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const isFormValid = credentials.username.length >= 3 && credentials.password.length >= 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="bg-primary rounded-xl p-3">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-medium text-foreground">Resilient Terminal</h1>
              <p className="text-sm text-muted-foreground">Orchestrator Platform</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Secure Access
            </Badge>
            <Badge variant="outline" className="text-xs">
              Honeywell Hackathon
            </Badge>
          </div>
        </div>

        {/* Login Form */}
        <Card className="border border-border bg-card shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Lock className="h-5 w-5 text-primary" />
              <span>Sign In</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access the platform
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={credentials.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                  disabled={isLoading}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Remember me on this device
                </Label>
              </div>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                This is a secure demonstration environment. All data is simulated.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Powered by Honeywell Industrial Automation
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <span>© 2024 Resilient Terminal Orchestrator</span>
            <span>•</span>
            <span>Enterprise Security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
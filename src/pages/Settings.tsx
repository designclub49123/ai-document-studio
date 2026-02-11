import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserStore } from '@/state/useUserStore';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  User, Palette, Bell, Shield, Database, Download,
  Trash2, Save, RefreshCw, Eye, EyeOff, Key, Monitor,
  Moon, Sun, Info, Settings2, FileText,
} from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const { theme, colorTheme, toggleTheme, setColorTheme } = useUserStore();
  const { user, updatePassword } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });

  // Profile
  const [profileData, setProfileData] = useState({
    name: '',
    email: user?.email || '',
    bio: '',
  });

  // Notification Settings (synced with user_settings table)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
  });

  // Editor Settings (synced with user_settings table)
  const [editorSettings, setEditorSettings] = useState({
    autoSave: true,
    autoSaveInterval: 30,
    fontSize: 14,
    fontFamily: 'Inter',
  });

  // Load profile + settings from Supabase
  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [profileRes, settingsRes] = await Promise.all([
          supabase.from('profiles').select('full_name, bio').eq('user_id', user.id).maybeSingle(),
          supabase.from('user_settings').select('*').eq('user_id', user.id).maybeSingle(),
        ]);

        if (profileRes.data) {
          setProfileData(prev => ({
            ...prev,
            name: profileRes.data.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '',
            bio: profileRes.data.bio || '',
          }));
        }

        if (settingsRes.data) {
          setNotifications({
            email: settingsRes.data.email_notifications,
            push: settingsRes.data.push_notifications,
          });
          setEditorSettings({
            autoSave: settingsRes.data.auto_save,
            autoSaveInterval: settingsRes.data.auto_save_interval,
            fontSize: settingsRes.data.font_size,
            fontFamily: settingsRes.data.font_family,
          });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: profileData.name, bio: profileData.bio })
        .eq('user_id', user.id);
      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = useCallback(async () => {
    if (!user) return;
    setIsSavingSettings(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .update({
          email_notifications: notifications.email,
          push_notifications: notifications.push,
          auto_save: editorSettings.autoSave,
          auto_save_interval: editorSettings.autoSaveInterval,
          font_size: editorSettings.fontSize,
          font_family: editorSettings.fontFamily,
          theme,
          color_theme: colorTheme,
        })
        .eq('user_id', user.id);
      if (error) throw error;
      toast.success('Settings saved');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSavingSettings(false);
    }
  }, [user, notifications, editorSettings, theme, colorTheme]);

  const handleChangePassword = async () => {
    if (!passwordForm.newPass || passwordForm.newPass.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await updatePassword(passwordForm.newPass);
      if (error) throw error;
      toast.success('Password updated successfully');
      setPasswordForm({ current: '', newPass: '', confirm: '' });
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data: docs } = await supabase
        .from('documents')
        .select('title, content, status, created_at, updated_at')
        .eq('user_id', user.id);

      const exportData = {
        profile: profileData,
        documents: docs || [],
        settings: { notifications, editorSettings },
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `papermorph-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion requires contacting support');
  };

  const handleResetSettings = async () => {
    if (!confirm('Are you sure you want to reset all settings to default?')) return;
    setNotifications({ email: true, push: false });
    setEditorSettings({ autoSave: true, autoSaveInterval: 30, fontSize: 14, fontFamily: 'Inter' });
    // Persist defaults
    if (user) {
      await supabase.from('user_settings').update({
        email_notifications: true,
        push_notifications: false,
        auto_save: true,
        auto_save_interval: 30,
        font_size: 14,
        font_family: 'Inter',
      }).eq('user_id', user.id);
    }
    toast.success('Settings reset to default');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account and application preferences</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="gap-2">
            <FileText className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" />Profile</TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2"><Palette className="h-4 w-4" />Appearance</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" />Notifications</TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2"><Shield className="h-4 w-4" />Privacy</TabsTrigger>
            <TabsTrigger value="advanced" className="gap-2"><Settings2 className="h-4 w-4" />Advanced</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={profileData.name} onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={profileData.email} disabled className="opacity-60" />
                    <p className="text-xs text-muted-foreground">Email cannot be changed here</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    className="w-full min-h-[100px] p-3 border border-border rounded-md resize-none bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Tell us about yourself..."
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    maxLength={500}
                  />
                </div>
                <Button onClick={handleSaveProfile} disabled={isLoading} className="gap-2">
                  <Save className="h-4 w-4" />
                  {isLoading ? 'Saving...' : 'Save Profile'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Key className="h-5 w-5" />Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password (min 8 characters)"
                      value={passwordForm.newPass}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPass: e.target.value }))}
                    />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                  />
                </div>
                <Button variant="outline" onClick={handleChangePassword} disabled={isLoading || !passwordForm.newPass} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  {isLoading ? 'Updating...' : 'Change Password'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" />Theme & Appearance</CardTitle>
                <CardDescription>Customize the look and feel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Theme Mode</Label>
                    <p className="text-sm text-muted-foreground">Choose between light and dark mode</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant={theme === 'light' ? 'default' : 'outline'} size="sm" onClick={() => theme === 'dark' && toggleTheme()} className="gap-2">
                      <Sun className="h-4 w-4" />Light
                    </Button>
                    <Button variant={theme === 'dark' ? 'default' : 'outline'} size="sm" onClick={() => theme === 'light' && toggleTheme()} className="gap-2">
                      <Moon className="h-4 w-4" />Dark
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Color Theme</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { name: 'orange' as const, color: 'bg-[hsl(15,90%,55%)]' },
                      { name: 'blue' as const, color: 'bg-[hsl(212,100%,50%)]' },
                      { name: 'green' as const, color: 'bg-[hsl(142,76%,36%)]' },
                      { name: 'red' as const, color: 'bg-[hsl(0,72%,51%)]' },
                    ].map((c) => (
                      <Button key={c.name} variant={colorTheme === c.name ? 'default' : 'outline'} onClick={() => setColorTheme(c.name)} className="gap-2 capitalize">
                        <div className={`w-3 h-3 rounded-full ${c.color}`} />
                        {c.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Monitor className="h-5 w-5" />Editor Settings</CardTitle>
                <CardDescription>Configure the editor behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-save">Auto Save</Label>
                      <Switch id="auto-save" checked={editorSettings.autoSave} onCheckedChange={(checked) => setEditorSettings(prev => ({ ...prev, autoSave: checked }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Auto-Save Interval (seconds)</Label>
                      <Select value={editorSettings.autoSaveInterval.toString()} onValueChange={(v) => setEditorSettings(prev => ({ ...prev, autoSaveInterval: parseInt(v) }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10s</SelectItem>
                          <SelectItem value="30">30s</SelectItem>
                          <SelectItem value="60">60s</SelectItem>
                          <SelectItem value="120">120s</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Font Size</Label>
                      <Select value={editorSettings.fontSize.toString()} onValueChange={(v) => setEditorSettings(prev => ({ ...prev, fontSize: parseInt(v) }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {[12, 14, 16, 18, 20].map(s => <SelectItem key={s} value={s.toString()}>{s}px</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Font Family</Label>
                      <Select value={editorSettings.fontFamily} onValueChange={(v) => setEditorSettings(prev => ({ ...prev, fontFamily: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat'].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <Button onClick={handleSaveSettings} disabled={isSavingSettings} className="gap-2 mt-4">
                  <Save className="h-4 w-4" />
                  {isSavingSettings ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'email' as const, label: 'Email Notifications', description: 'Receive notifications via email' },
                  { key: 'push' as const, label: 'Push Notifications', description: 'Receive browser push notifications' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3">
                    <div className="space-y-1">
                      <Label>{item.label}</Label>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, [item.key]: checked }))}
                    />
                  </div>
                ))}
                <Button onClick={handleSaveSettings} disabled={isSavingSettings} className="gap-2 mt-4">
                  <Save className="h-4 w-4" />
                  {isSavingSettings ? 'Saving...' : 'Save Notification Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" />Data Management</CardTitle>
                <CardDescription>Manage your personal data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="space-y-1">
                    <Label className="font-medium">Export All Data</Label>
                    <p className="text-sm text-muted-foreground">Download all your documents and data</p>
                  </div>
                  <Button variant="outline" onClick={handleExportData} disabled={isLoading} className="gap-2">
                    <Download className="h-4 w-4" />
                    {isLoading ? 'Exporting...' : 'Export'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/30 bg-destructive/5">
                  <div className="space-y-1">
                    <Label className="font-medium text-destructive">Delete Account</Label>
                    <p className="text-sm text-destructive">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount} className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Settings2 className="h-5 w-5" />Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="space-y-1">
                    <Label className="font-medium">Reset All Settings</Label>
                    <p className="text-sm text-muted-foreground">Reset all settings to their default values</p>
                  </div>
                  <Button variant="outline" onClick={handleResetSettings} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Reset Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />Application Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-sm font-medium">Version</Label><p className="text-sm text-muted-foreground">6.0.0</p></div>
                  <div><Label className="text-sm font-medium">Environment</Label><p className="text-sm text-muted-foreground">Production</p></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

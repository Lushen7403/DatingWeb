import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    maxUsersPerPage: 10,
    allowNewRegistrations: true,
    enableEmailNotifications: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNumberChange = (key: keyof typeof settings, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setSettings(prev => ({
        ...prev,
        [key]: numValue
      }));
    }
  };

  const handleSave = () => {
    // Implement save functionality
    toast.success("Settings saved successfully");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">System Settings</h1>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable maintenance mode to restrict access to the system
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={() => handleToggle("maintenanceMode")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow New Registrations</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable new user registrations
                </p>
              </div>
              <Switch
                checked={settings.allowNewRegistrations}
                onCheckedChange={() => handleToggle("allowNewRegistrations")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable email notifications
                </p>
              </div>
              <Switch
                checked={settings.enableEmailNotifications}
                onCheckedChange={() => handleToggle("enableEmailNotifications")}
              />
            </div>

            <div className="space-y-2">
              <Label>Max Users Per Page</Label>
              <Input
                type="number"
                value={settings.maxUsersPerPage}
                onChange={(e) => handleNumberChange("maxUsersPerPage", e.target.value)}
                min={1}
                max={100}
              />
              <p className="text-sm text-muted-foreground">
                Maximum number of users to display per page in the users list
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings; 
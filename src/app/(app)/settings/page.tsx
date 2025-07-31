import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Customize the look and feel of the app.
        </p>
        <Separator className="mt-4" />
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Select your preferred color scheme.</CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeSwitcher />
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Manage how you receive alerts and updates.
        </p>
        <Separator className="mt-4" />
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Choose what you want to be notified about.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                  <Label htmlFor="budget-alerts">Budget Alerts</Label>
                  <p className="text-sm text-muted-foreground">Notify me when I'm nearing my budget limits.</p>
              </div>
              <Switch id="budget-alerts" defaultChecked />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                  <Label htmlFor="unusual-transactions">Unusual Transactions</Label>
                  <p className="text-sm text-muted-foreground">Alert me about suspicious activity on my accounts.</p>
              </div>
              <Switch id="unusual-transactions" defaultChecked />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                  <Label htmlFor="bill-reminders">Bill Reminders</Label>
                  <p className="text-sm text-muted-foreground">Send me reminders for upcoming bill payments.</p>
              </div>
              <Switch id="bill-reminders" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

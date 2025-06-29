import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Globe, Bell, Palette, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6 sm:py-10 px-4 space-y-8">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground">الإعدادات</h1>
        <p className="text-muted-foreground mt-1">إدارة تفضيلات حسابك وإعدادات التطبيق.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Navigation / Sections (Optional - for future expansion) */}
        {/* For now, we'll just list sections directly */}

        {/* Main Settings Content */}
        <div className="md:col-span-3 space-y-6">
          {/* Account Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ShieldCheck className="h-6 w-6 text-primary" />
                إعدادات الحساب
              </CardTitle>
              <CardDescription>تحديث معلومات ملفك الشخصي وتفضيلات الأمان.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">الاسم الكامل</Label>
                <Input id="fullName" defaultValue="اسم المستخدم الحالي" placeholder="أدخل اسمك الكامل" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" defaultValue="user@example.com" placeholder="أدخل بريدك الإلكتروني" />
              </div>
              <Button className="moroccan-gradient text-white">حفظ التغييرات</Button>
            </CardContent>
          </Card>

          {/* Notification Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Bell className="h-6 w-6 text-primary" />
                إعدادات الإشعارات
              </CardTitle>
              <CardDescription>اختر كيف تتلقى الإشعارات من التطبيق.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="emailNotifications" className="flex flex-col space-y-1">
                  <span>إشعارات البريد الإلكتروني</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    تلقي تحديثات مهمة عبر البريد الإلكتروني.
                  </span>
                </Label>
                <Switch id="emailNotifications" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="pushNotifications" className="flex flex-col space-y-1">
                  <span>إشعارات لحظية</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    تلقي إشعارات مباشرة على جهازك.
                  </span>
                </Label>
                <Switch id="pushNotifications" />
              </div>
               <Separator />
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="promotionalContent" className="flex flex-col space-y-1">
                  <span>محتوى ترويجي</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    تلقي عروض ومنتجات جديدة.
                  </span>
                </Label>
                <Switch id="promotionalContent" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Language & Region Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Globe className="h-6 w-6 text-primary" />
                اللغة والمنطقة
              </CardTitle>
              <CardDescription>اختر لغة العرض المفضلة لديك.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">لغة العرض</Label>
                {/* This would ideally be a Select component */}
                <Input id="language" defaultValue="العربية (المغرب)" disabled />
                <p className="text-sm text-muted-foreground">
                  اللغة الحالية هي العربية. تغيير اللغة غير متاح حالياً.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Theme/Appearance Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Palette className="h-6 w-6 text-primary" />
                المظهر
              </CardTitle>
              <CardDescription>تخصيص مظهر التطبيق.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="darkMode" className="flex flex-col space-y-1">
                  <span>الوضع الداكن</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    تفعيل الوضع الداكن لتجربة مريحة للعين ليلاً.
                  </span>
                </Label>
                <Switch id="darkMode" />
              </div>
               <p className="text-sm text-muted-foreground">
                  الوضع الداكن غير متاح حالياً.
                </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

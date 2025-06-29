import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit, Save, X, Upload, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const moroccanCities = [
  "الرباط",
  "الدار البيضاء",
  "فاس",
  "مراكش",
  "طنجة",
  "أكادير",
  "مكناس",
  "وجدة",
  "الجديدة",
  "القنيطرة",
  "تطوان",
  "سلا",
  "تمارة",
  "المحمدية",
  "العرائش",
  "خريبكة",
  "برشيد",
  "إنزكان",
  "سطات",
  "الناظور",
];

const profileSchema = z.object({
  firstName: z.string().min(2, "الاسم الأول يجب أن يكون حرفين على الأقل"),
  lastName: z.string().min(2, "اسم العائلة يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z
    .string()
    .min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل")
    .regex(/^[0-9+\-\s]+$/, "رقم الهاتف غير صحيح"),
  city: z.string().min(1, "المدينة م��لوبة"),
  nationalId: z
    .string()
    .min(8, "رقم البطاقة الوطنية يجب أن يكون 8 أرقام على الأقل")
    .regex(
      /^[A-Z]{1,2}[0-9]{6,8}$/,
      "رقم البطاقة الوطنية غير صحيح (مثال: AB123456)",
    ),
  gender: z.enum(["male", "female"], { required_error: "الجنس مطلوب" }),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      city: user?.city || "",
      nationalId: user?.nationalId || "",
      gender: user?.gender || "male",
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      await updateProfile(data);
      setIsEditing(false);
      toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم حفظ تغييراتك بنجاح",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء حفظ التغييرات",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      city: user?.city || "",
      nationalId: user?.nationalId || "",
      gender: user?.gender || "male",
    });
    setIsEditing(false);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const avatar = e.target?.result as string;
        try {
          await updateProfile({ avatar });
          toast({
            title: "تم تحديث الصورة الشخصية",
            description: "تم رفع صورتك الجديدة بنجاح",
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "خطأ في رفع الصورة",
            description: "حدث خطأ أثناء رفع الصورة",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">الملف الشخصي</h1>
        <div className="flex items-center space-x-reverse space-x-2">
          {user?.isVerified && (
            <Badge className="bg-green-100 text-green-800">
              <Check className="w-3 h-3 ml-1" />
              محقق
            </Badge>
          )}
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 ml-2" />
              تعديل
            </Button>
          ) : (
            <div className="flex space-x-reverse space-x-2">
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="moroccan-gradient text-white border-0"
              >
                <Save className="w-4 h-4 ml-2" />
                {isLoading ? "جاري الحفظ..." : "حفظ"}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 ml-2" />
                إلغاء
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Photo & Stats */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <img
                  src={
                    user?.avatar ||
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-primary/80 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-muted-foreground">{user?.email}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  مسوق منذ{" "}
                  {new Date(user?.joinedAt || "").toLocaleDateString("ar-MA")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {user?.totalOrders}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    إجمالي الطلبات
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {user?.totalEarnings?.toLocaleString()} د.م
                  </p>
                  <p className="text-sm text-muted-foreground">
                    إجمالي الأرباح
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>المعلومات الشخصية</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">الاسم الأول *</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    disabled={!isEditing}
                    className={`text-right ${
                      errors.firstName ? "border-destructive" : ""
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive text-right">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">اسم العائلة *</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    disabled={!isEditing}
                    className={`text-right ${
                      errors.lastName ? "border-destructive" : ""
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive text-right">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  disabled={!isEditing}
                  className={`text-right ${
                    errors.email ? "border-destructive" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-destructive text-right">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    disabled={!isEditing}
                    className={`text-right ${
                      errors.phone ? "border-destructive" : ""
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive text-right">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">المدينة *</Label>
                  <Select
                    value={watch("city")}
                    onValueChange={(value) => setValue("city", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger
                      className={`text-right ${
                        errors.city ? "border-destructive" : ""
                      }`}
                    >
                      <SelectValue placeholder="اختر مدينتك" />
                    </SelectTrigger>
                    <SelectContent>
                      {moroccanCities.map((city) => (
                        <SelectItem
                          key={city}
                          value={city}
                          className="text-right"
                        >
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.city && (
                    <p className="text-sm text-destructive text-right">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationalId">رقم البطاقة الوطنية *</Label>
                <Input
                  id="nationalId"
                  {...register("nationalId")}
                  disabled={!isEditing}
                  placeholder="AB123456"
                  className={`text-right ${
                    errors.nationalId ? "border-destructive" : ""
                  }`}
                />
                {errors.nationalId && (
                  <p className="text-sm text-destructive text-right">
                    {errors.nationalId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>الجنس *</Label>
                <RadioGroup
                  value={watch("gender")}
                  onValueChange={(value) =>
                    setValue("gender", value as "male" | "female")
                  }
                  disabled={!isEditing}
                  className="flex justify-end space-x-reverse space-x-6"
                >
                  <div className="flex items-center space-x-reverse space-x-2">
                    <Label htmlFor="male" className="cursor-pointer">
                      ذكر
                    </Label>
                    <RadioGroupItem value="male" id="male" />
                  </div>
                  <div className="flex items-center space-x-reverse space-x-2">
                    <Label htmlFor="female" className="cursor-pointer">
                      أنثى
                    </Label>
                    <RadioGroupItem value="female" id="female" />
                  </div>
                </RadioGroup>
                {errors.gender && (
                  <p className="text-sm text-destructive text-right">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات الدفع</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>طريقة الدفع</Label>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium">
                  {user?.paymentMethod === "bank" ? "تحويل بنكي" : "Cash Plus"}
                </p>
                {user?.paymentMethod === "bank" && (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-muted-foreground">
                      البنك: {user.bankName}
                    </p>
                    <p className="text-sm text-muted-foreground font-mono">
                      RIB: {user.ribNumber}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>حالة التحقق</Label>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-reverse space-x-2">
                  {user?.isVerified ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-medium">
                        حساب محقق
                      </span>
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 text-red-600" />
                      <span className="text-red-600 font-medium">
                        في انتظار التحقق
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {user?.isVerified
                    ? "تم التحقق من هويتك ومعلومات الدفع"
                    : "سيتم التحقق من معلوماتك خلال 24 ساعة"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

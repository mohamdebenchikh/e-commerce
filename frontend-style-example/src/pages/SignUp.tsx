import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

// Moroccan cities list
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

// Step 1: Personal Information
const step1Schema = z
  .object({
    firstName: z.string().min(2, "الاسم الأول يجب أن يكون حرفين على الأقل"),
    lastName: z.string().min(2, "اسم العائلة يجب أن يكون حرفين على الأقل"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string(),
    gender: z.enum(["male", "female"], { required_error: "الجنس مطلوب" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

// Step 2: Contact Information
const step2Schema = z.object({
  phone: z
    .string()
    .min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل")
    .regex(/^[0-9+\-\s]+$/, "رقم الهاتف غير صحيح"),
  city: z.string().min(1, "المدينة مطلوبة"),
  nationalId: z
    .string()
    .min(8, "رقم البطاقة الوطنية يجب أن يكون 8 أرقام على الأقل")
    .regex(
      /^[A-Z]{1,2}[0-9]{6,8}$/,
      "رقم البطاقة الوطنية غير صحيح (مثال: AB123456)",
    ),
});

// Step 3: Payment Information
const step3Schema = z
  .object({
    paymentMethod: z.enum(["cashplus", "bank"], {
      required_error: "طريقة الدفع مطلوبة",
    }),
    ribNumber: z.string().optional(),
    bankName: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === "bank") {
        return data.ribNumber && data.ribNumber.length >= 24 && data.bankName;
      }
      return true;
    },
    {
      message: "معلومات البنك مطلوبة عند اختيار الدفع البنكي",
      path: ["ribNumber"],
    },
  );

type Step1Form = z.infer<typeof step1Schema>;
type Step2Form = z.infer<typeof step2Schema>;
type Step3Form = z.infer<typeof step3Schema>;

export default function SignUp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<
    Partial<Step1Form & Step2Form & Step3Form>
  >({});

  const navigate = useNavigate();
  const { toast } = useToast();

  const step1Form = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
    defaultValues: formData,
  });

  const step2Form = useForm<Step2Form>({
    resolver: zodResolver(step2Schema),
    defaultValues: formData,
  });

  const step3Form = useForm<Step3Form>({
    resolver: zodResolver(step3Schema),
    defaultValues: formData,
  });

  const getCurrentForm = () => {
    switch (currentStep) {
      case 1:
        return step1Form;
      case 2:
        return step2Form;
      case 3:
        return step3Form;
      default:
        return step1Form;
    }
  };

  const nextStep = async () => {
    const form = getCurrentForm();
    const isValid = await form.trigger();

    if (isValid) {
      const data = form.getValues();
      setFormData((prev) => ({ ...prev, ...data }));

      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        await handleSubmit();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "مرحباً بك في سوق المغرب! يمكنك الآن تسجيل الدخول",
      });

      navigate("/signin");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في إنشاء الحساب",
        description: "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 mx-2 ${
                step < currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          المعلومات الشخصية
        </h2>
        <p className="text-muted-foreground">أدخل معلوماتك الأساسية</p>
      </div>

      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-right block">
              الاسم الأول *
            </Label>
            <Input
              id="firstName"
              placeholder="أدخل اسمك الأول"
              className={`text-right ${
                step1Form.formState.errors.firstName ? "border-destructive" : ""
              }`}
              {...step1Form.register("firstName")}
            />
            {step1Form.formState.errors.firstName && (
              <p className="text-sm text-destructive text-right">
                {step1Form.formState.errors.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-right block">
              اسم العائلة *
            </Label>
            <Input
              id="lastName"
              placeholder="أدخل اسم العائلة"
              className={`text-right ${
                step1Form.formState.errors.lastName ? "border-destructive" : ""
              }`}
              {...step1Form.register("lastName")}
            />
            {step1Form.formState.errors.lastName && (
              <p className="text-sm text-destructive text-right">
                {step1Form.formState.errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-right block">
            البريد الإلكتروني *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="أدخل بريدك الإلكتروني"
            className={`text-right ${
              step1Form.formState.errors.email ? "border-destructive" : ""
            }`}
            {...step1Form.register("email")}
          />
          {step1Form.formState.errors.email && (
            <p className="text-sm text-destructive text-right">
              {step1Form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender" className="text-right block">
            الجنس *
          </Label>
          <RadioGroup
            value={step1Form.watch("gender")}
            onValueChange={(value) =>
              step1Form.setValue("gender", value as "male" | "female")
            }
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
          {step1Form.formState.errors.gender && (
            <p className="text-sm text-destructive text-right">
              {step1Form.formState.errors.gender.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-right block">
            كلمة المرور *
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="أدخل كلمة المرور"
              className={`text-right pl-10 ${
                step1Form.formState.errors.password ? "border-destructive" : ""
              }`}
              {...step1Form.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {step1Form.formState.errors.password && (
            <p className="text-sm text-destructive text-right">
              {step1Form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-right block">
            تأكيد كلمة المرور *
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="أعد إدخال كلمة المرور"
              className={`text-right pl-10 ${
                step1Form.formState.errors.confirmPassword
                  ? "border-destructive"
                  : ""
              }`}
              {...step1Form.register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {step1Form.formState.errors.confirmPassword && (
            <p className="text-sm text-destructive text-right">
              {step1Form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          معلومات التواصل
        </h2>
        <p className="text-muted-foreground">أدخل معلومات التواصل والعنوان</p>
      </div>

      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-right block">
            رقم الهاتف *
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+212 6XX-XXXXXX"
            className={`text-right ${
              step2Form.formState.errors.phone ? "border-destructive" : ""
            }`}
            {...step2Form.register("phone")}
          />
          {step2Form.formState.errors.phone && (
            <p className="text-sm text-destructive text-right">
              {step2Form.formState.errors.phone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-right block">
            المدينة *
          </Label>
          <Select
            value={step2Form.watch("city")}
            onValueChange={(value) => step2Form.setValue("city", value)}
          >
            <SelectTrigger
              className={`text-right ${
                step2Form.formState.errors.city ? "border-destructive" : ""
              }`}
            >
              <SelectValue placeholder="اختر مدينتك" />
            </SelectTrigger>
            <SelectContent>
              {moroccanCities.map((city) => (
                <SelectItem key={city} value={city} className="text-right">
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {step2Form.formState.errors.city && (
            <p className="text-sm text-destructive text-right">
              {step2Form.formState.errors.city.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationalId" className="text-right block">
            رقم البطاقة الوطنية *
          </Label>
          <Input
            id="nationalId"
            placeholder="AB123456"
            className={`text-right ${
              step2Form.formState.errors.nationalId ? "border-destructive" : ""
            }`}
            {...step2Form.register("nationalId")}
          />
          <p className="text-xs text-muted-foreground text-right">
            مثال: AB123456 (حرف أو حرفان متبوعان بأرقام)
          </p>
          {step2Form.formState.errors.nationalId && (
            <p className="text-sm text-destructive text-right">
              {step2Form.formState.errors.nationalId.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">طريقة الدفع</h2>
        <p className="text-muted-foreground">
          اختر طريقة استلام الأرباح المفضلة لديك
        </p>
      </div>

      <form className="space-y-6">
        <div className="space-y-4">
          <Label className="text-right block text-base font-medium">
            طريقة الدفع المفضلة *
          </Label>

          <RadioGroup
            value={step3Form.watch("paymentMethod")}
            onValueChange={(value) =>
              step3Form.setValue("paymentMethod", value as "cashplus" | "bank")
            }
            className="space-y-4"
          >
            {/* Cash Plus Option */}
            <div className="flex items-center space-x-reverse space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="cashplus" id="cashplus" />
              <div className="flex-1 text-right">
                <Label
                  htmlFor="cashplus"
                  className="cursor-pointer font-medium"
                >
                  Cash Plus
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  استلم أرباحك نقداً من أي وكالة Cash Plus في المغرب
                </p>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
            </div>

            {/* Bank Transfer Option */}
            <div className="flex items-center space-x-reverse space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="bank" id="bank" />
              <div className="flex-1 text-right">
                <Label htmlFor="bank" className="cursor-pointer font-medium">
                  تحويل بنكي
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  استلم أرباحك مباشرة في حسابك البنكي
                </p>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                <Building className="h-4 w-4 text-primary" />
              </div>
            </div>
          </RadioGroup>

          {step3Form.formState.errors.paymentMethod && (
            <p className="text-sm text-destructive text-right">
              {step3Form.formState.errors.paymentMethod.message}
            </p>
          )}
        </div>

        {/* Bank Details - Show only if bank is selected */}
        {step3Form.watch("paymentMethod") === "bank" && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
            <h3 className="font-medium text-right">معلومات الحساب البنكي</h3>

            <div className="space-y-2">
              <Label htmlFor="bankName" className="text-right block">
                اسم البنك *
              </Label>
              <Select
                value={step3Form.watch("bankName")}
                onValueChange={(value) => step3Form.setValue("bankName", value)}
              >
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر البنك" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attijari" className="text-right">
                    التجاري وفا بنك
                  </SelectItem>
                  <SelectItem value="bmce" className="text-right">
                    BMCE بنك
                  </SelectItem>
                  <SelectItem value="bmci" className="text-right">
                    BMCI
                  </SelectItem>
                  <SelectItem value="cih" className="text-right">
                    CIH بنك
                  </SelectItem>
                  <SelectItem value="creditagricole" className="text-right">
                    القرض الفلاحي
                  </SelectItem>
                  <SelectItem value="sgmb" className="text-right">
                    سوسيتيه جنرال المغرب
                  </SelectItem>
                  <SelectItem value="cdm" className="text-right">
                    بنك المغرب
                  </SelectItem>
                  <SelectItem value="cfm" className="text-right">
                    Crédit du Maroc
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ribNumber" className="text-right block">
                رقم RIB *
              </Label>
              <Input
                id="ribNumber"
                placeholder="230 XXX XXXXXXXXXXXX XX"
                className={`text-right font-mono ${
                  step3Form.formState.errors.ribNumber
                    ? "border-destructive"
                    : ""
                }`}
                {...step3Form.register("ribNumber")}
              />
              <p className="text-xs text-muted-foreground text-right">
                رقم RIB يجب أن يكون 24 رقماً (مع أو بدون مسافات)
              </p>
              {step3Form.formState.errors.ribNumber && (
                <p className="text-sm text-destructive text-right">
                  {step3Form.formState.errors.ribNumber.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-reverse space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-800 text-right">
                تأكد من صحة معلومات الحساب البنكي. ستُستخدم هذه المعلومات لتحويل
                أرباحك
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-background rtl" dir="rtl">
      {/* Moroccan Pattern Background */}
      <div className="fixed inset-0 bg-moroccan-pattern opacity-5 pointer-events-none" />

      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center">
              <Button variant="ghost" size="sm">
                <ArrowRight className="h-4 w-4 ml-2" />
                العودة للرئيسية
              </Button>
            </Link>
            <Link to="/" className="text-2xl font-bold text-primary">
              سوق المغرب
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-moroccan border-0">
            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-3xl font-bold text-foreground">
                إنشاء حساب جديد
              </CardTitle>
              <p className="text-muted-foreground">
                انضم إلى سوق المغرب وابدأ رحلتك في التسويق الإلكتروني
              </p>
            </CardHeader>

            <CardContent className="space-y-8">
              {renderStepIndicator()}

              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 ml-2" />
                  السابق
                </Button>

                <Button
                  onClick={nextStep}
                  disabled={isLoading}
                  className="moroccan-gradient text-white border-0 flex items-center"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                      جاري الإنشاء...
                    </div>
                  ) : (
                    <>
                      {currentStep === 3 ? "إنشاء الحساب" : "التالي"}
                      {currentStep < 3 && (
                        <ArrowRight className="h-4 w-4 mr-2" />
                      )}
                    </>
                  )}
                </Button>
              </div>

              {/* Sign In Link */}
              <div className="text-center text-sm pt-4 border-t">
                <span className="text-muted-foreground">
                  لديك حساب بالفعل؟{" "}
                </span>
                <Link
                  to="/signin"
                  className="text-primary hover:underline font-medium"
                >
                  تسجيل الدخول
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

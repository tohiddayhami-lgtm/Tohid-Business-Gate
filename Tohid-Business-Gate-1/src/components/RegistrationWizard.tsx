import React, { useState } from 'react';
import { useWizardStore } from '@/src/store/useWizardStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, Globe, FileText, Users, DollarSign, Upload, CheckCircle2, CreditCard, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

const RegistrationWizard = () => {
  const { data, updateData } = useWizardStore();
  const [loading, setLoading] = useState(false);
  const [aiDescription, setAiDescription] = useState('');
  const [suggestions, setSuggestions] = useState<{code: string, label: string}[]>([]);

  const nextStep = () => updateData({ step: Math.min(data.step + 1, 10) });
  const prevStep = () => updateData({ step: Math.max(data.step - 1, 1) });

  const progress = (data.step / 10) * 100;

  const handleSuggest = async () => {
    if (!aiDescription) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/suggest-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: aiDescription })
      });
      const result = await res.json();
      setSuggestions(result);
    } catch (e) {
      toast.error("خطا در سرویس هوش مصنوعی");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (data.step) {
      case 1:
        return (
          <div className="space-y-6">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold">مرحله ۱: انتخاب ساختار شرکت</CardTitle>
              <CardDescription>نوع شخصیت حقوقی شرکت عمانی خود را انتخاب کنید.</CardDescription>
            </CardHeader>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { id: 'LLC', title: 'LLC', desc: 'شرکت با مسئولیت محدود - حداقل ۲ سهامدار', icon: Building2 },
                { id: 'SPC', title: 'SPC', desc: 'شرکت یک‌نفره - کارآفرین انفرادی', icon: Users },
                { id: 'BRANCH', title: 'دفتر شعبه', desc: 'گسترش شرکت خارجی', icon: Globe },
                { id: 'REP_OFFICE', title: 'دفتر نمایندگی', desc: 'فقط برای تحقیقات بازار', icon: FileText },
              ].map((item) => (
                <Card
                  key={item.id}
                  className={`cursor-pointer border-2 transition-all hover:shadow-lg ${data.structure === item.id ? 'border-[#1B5E3F] bg-[#1B5E3F]/5' : 'border-slate-100'}`}
                  onClick={() => updateData({ structure: item.id })}
                >
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className={`p-3 rounded-2xl ${data.structure === item.id ? 'bg-[#1B5E3F] text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <CardHeader className="px-0 text-center">
              <CardTitle className="text-2xl font-bold">مرحله ۲: انتخاب حوزه قضایی</CardTitle>
              <CardDescription>بین سرزمین اصلی عمان یا منطقه آزاد انتخاب کنید.</CardDescription>
            </CardHeader>
            <Tabs
              value={data.jurisdiction}
              onValueChange={(val) => updateData({ jurisdiction: val as any })}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100 rounded-2xl h-14">
                <TabsTrigger value="mainland" className="rounded-xl h-12 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">سرزمین اصلی</TabsTrigger>
                <TabsTrigger value="freezone" className="rounded-xl h-12 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">منطقه آزاد</TabsTrigger>
              </TabsList>

              <TabsContent value="freezone" className="mt-8 space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {['منطقه آزاد صحار', 'منطقه آزاد صلاله', 'منطقه ویژه دقم', 'المزونه', 'واحه دانش مسقط'].map((zone) => (
                    <div
                      key={zone}
                      onClick={() => updateData({ freeZone: zone })}
                      className={`p-4 border-2 rounded-2xl cursor-pointer flex items-center justify-between transition-all ${data.freeZone === zone ? 'border-[#1B5E3F] bg-[#1B5E3F]/5' : 'border-slate-100 hover:bg-slate-50'}`}
                    >
                      <span className="font-medium text-slate-800">{zone}</span>
                      {data.freeZone === zone && <CheckCircle2 className="text-[#1B5E3F]" size={20} />}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                مرحله ۳: فعالیت تجاری
                <Badge variant="secondary" className="bg-[#1B5E3F]/10 text-[#1B5E3F]">هوش مصنوعی</Badge>
              </CardTitle>
              <CardDescription>شرکت شما چه کاری انجام می‌دهد؟ توضیح دهید تا کدهای فعالیت مرتبط پیشنهاد دهیم.</CardDescription>
            </CardHeader>

            <div className="space-y-4">
              <div className="relative">
                <Label>توضیح کسب‌وکار</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="مثلاً: اپلیکیشن موبایل می‌سازیم و مشاوره IT ارائه می‌دهیم..."
                    value={aiDescription}
                    onChange={(e) => setAiDescription(e.target.value)}
                    className="rounded-xl h-12"
                  />
                  <Button
                    onClick={handleSuggest}
                    disabled={loading || !aiDescription}
                    className="rounded-xl h-12 bg-[#1B5E3F] hover:bg-[#1B5E3F]/90 shrink-0"
                  >
                    {loading ? "..." : <Sparkles size={20} />}
                  </Button>
                </div>
              </div>

              {suggestions.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 mb-3 tracking-wider">فعالیت‌های پیشنهادی</p>
                  <div className="space-y-2">
                    {suggestions.map((s) => (
                      <div key={s.code} className="flex items-center gap-3 bg-white p-3 rounded-xl border shadow-sm">
                        <Checkbox
                          id={s.code}
                          checked={data.activities.includes(s.label)}
                          onCheckedChange={(checked) => {
                            const next = checked
                              ? [...data.activities, s.label]
                              : data.activities.filter(a => a !== s.label);
                            updateData({ activities: next });
                          }}
                        />
                        <Label htmlFor={s.code} className="cursor-pointer font-medium">{s.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold">مرحله ۴: رزرو نام تجاری</CardTitle>
              <CardDescription>۳ نام به ترتیب اولویت پیشنهاد دهید.</CardDescription>
            </CardHeader>
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold text-slate-400">نام عربی {i + 1}</Label>
                    <Input
                      placeholder="الأسم باللغة العربية"
                      className="mt-1 rtl"
                      value={data.tradeNames[i]?.ar || ''}
                      onChange={(e) => {
                        const names = [...data.tradeNames];
                        names[i] = { ...names[i], ar: e.target.value };
                        updateData({ tradeNames: names });
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-slate-400">نام لاتین {i + 1}</Label>
                    <Input
                      placeholder="نام به لاتین"
                      className="mt-1 ltr"
                      value={data.tradeNames[i]?.en || ''}
                      onChange={(e) => {
                        const names = [...data.tradeNames];
                        names[i] = { ...names[i], en: e.target.value };
                        updateData({ tradeNames: names });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold">مرحله ۵: سهامداران و سرمایه</CardTitle>
              <CardDescription>مالکیت و میزان سرمایه را تعریف کنید.</CardDescription>
            </CardHeader>
            <div className="space-y-6">
              <div>
                <Label>حداقل سرمایه (ریال عمان)</Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input
                    type="number"
                    className="pr-10 h-12 rounded-xl ltr text-right"
                    value={data.capital}
                    onChange={(e) => updateData({ capital: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="font-bold">سهامداران</Label>
                  <Button variant="outline" size="sm" onClick={() => updateData({ shareholders: [...data.shareholders, { name: '', nationality: 'عمان', passportNumber: '', equity: 0 }] })}>+ افزودن</Button>
                </div>
                {data.shareholders.map((sh, i) => (
                  <Card key={i} className="p-4 border-slate-100 shadow-sm rounded-2xl">
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="نام کامل" value={sh.name} onChange={(e) => {
                        const next = [...data.shareholders];
                        next[i].name = e.target.value;
                        updateData({ shareholders: next });
                      }} />
                      <Input placeholder="ملیت" value={sh.nationality} onChange={(e) => {
                        const next = [...data.shareholders];
                        next[i].nationality = e.target.value;
                        updateData({ shareholders: next });
                      }} />
                      <Input placeholder="شماره پاسپورت" className="ltr" value={sh.passportNumber} onChange={(e) => {
                        const next = [...data.shareholders];
                        next[i].passportNumber = e.target.value;
                        updateData({ shareholders: next });
                      }} />
                      <Input type="number" placeholder="درصد سهام" className="ltr text-right" value={sh.equity} onChange={(e) => {
                        const next = [...data.shareholders];
                        next[i].equity = Number(e.target.value);
                        updateData({ shareholders: next });
                      }} />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold">مرحله ۶: بارگذاری مدارک</CardTitle>
              <CardDescription>مدارک هویتی لازم را بارگذاری کنید.</CardDescription>
            </CardHeader>
            <div className="grid gap-4">
              {[
                { label: 'کپی پاسپورت', required: true },
                { label: 'عکس پاسپورت', required: true },
                { label: 'صورت‌حساب بانکی', required: false },
                { label: 'مدارک تحصیلی', required: false },
              ].map((doc) => (
                <div key={doc.label} className="p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:border-[#1B5E3F]/50 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-[#1B5E3F]/10 group-hover:text-[#1B5E3F] transition-colors"><Upload size={20} /></div>
                      <div>
                        <p className="font-bold">{doc.label}</p>
                        <p className="text-xs text-slate-400">{doc.required ? 'الزامی' : 'اختیاری'}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">انتخاب فایل</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold">مرحله ۷: تنظیم اساسنامه</CardTitle>
              <CardDescription>پیش‌نمایش اساسنامه شرکت خود را مشاهده کنید.</CardDescription>
            </CardHeader>
            <Card className="bg-slate-50 border-slate-200 p-8 leading-loose text-slate-800">
              <h3 className="text-center font-bold text-lg mb-4">اساسنامه شرکت</h3>
              <p className="mb-2">این شرکت با نام <strong>{data.tradeNames[0]?.ar || data.tradeNames[0]?.en || "[نام تجاری]"}</strong> شناخته خواهد شد.</p>
              <p className="mb-2">ساختار شرکت <strong>{data.structure || "[ساختار]"}</strong> می‌باشد.</p>
              <p className="mb-2">فعالیت‌های اصلی شامل <strong>{data.activities.join('، ') || "[فعالیت‌ها]"}</strong> می‌شود.</p>
              <div className="mt-8 border-t pt-4">
                <p className="text-xs text-slate-400 italic">این پیش‌نویس به‌صورت خودکار بر اساس اطلاعات وارد شده تولید شده است.</p>
              </div>
            </Card>
          </div>
        );
      case 8:
        return (
          <div className="space-y-6">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold">مرحله ۸: تأییدیه‌های تکمیلی</CardTitle>
              <CardDescription>ثبت‌نام‌های الزامی را تأیید کنید.</CardDescription>
            </CardHeader>
            <div className="space-y-4">
              {[
                { id: 'tax', label: 'ثبت مالیاتی (خودکار)', desc: 'ثبت برای مالیات بر ارزش افزوده و مالیات شرکتی' },
                { id: 'pasi', label: 'ثبت‌نام اجتماعی PASI', desc: 'بیمه تأمین اجتماعی کارکنان' },
                { id: 'municipality', label: 'مجوز شهرداری', desc: 'تأیید بلدیه محلی' },
                { id: 'occi', label: 'عضویت اتاق بازرگانی', desc: 'اتاق بازرگانی عمان (OCCI)' },
              ].map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <Checkbox id={item.id} />
                  <div>
                    <Label htmlFor={item.id} className="font-bold cursor-pointer">{item.label}</Label>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 9:
        return (
          <div className="space-y-6">
            <CardHeader className="px-0 text-center">
              <CardTitle className="text-3xl font-bold text-[#1B5E3F]">آماده ارسال هستید؟</CardTitle>
              <CardDescription>قبل از نهایی‌سازی، تمام جزئیات را بررسی کنید.</CardDescription>
            </CardHeader>
            <div className="grid md:grid-cols-2 gap-6 pb-6 border-b">
              <div className="space-y-1">
                <Label className="text-slate-400">ساختار</Label>
                <p className="font-bold text-lg">{data.structure}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-slate-400">حوزه قضایی</Label>
                <p className="font-bold text-lg">{data.jurisdiction === 'mainland' ? 'سرزمین اصلی' : data.freeZone}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-slate-400">فعالیت‌های اصلی</Label>
                <p className="font-bold">{data.activities.slice(0, 2).join('، ')}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-slate-400">سرمایه</Label>
                <p className="font-bold text-lg">{data.capital.toLocaleString('fa-IR')} ریال عمان</p>
              </div>
            </div>
            <div className="flex justify-between items-center py-4 text-xl font-bold">
              <span>جمع کل هزینه‌ها</span>
              <span className="text-[#1B5E3F] text-2xl">۴۵۰٫۰۰۰ ریال عمان</span>
            </div>
          </div>
        );
      case 10:
        return (
          <div className="space-y-8 text-center">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold">مرحله نهایی: پرداخت امن</CardTitle>
              <CardDescription>هزینه‌های دولتی و خدماتی را از طریق درگاه پرداخت امن (ثانی، عمان‌نت یا استرایپ) پرداخت کنید.</CardDescription>
            </CardHeader>
            <div className="max-w-sm mx-auto p-8 border-2 border-slate-100 rounded-[2.5rem] space-y-6">
              <div className="w-16 h-16 bg-[#1B5E3F]/10 text-[#1B5E3F] rounded-full flex items-center justify-center mx-auto">
                <CreditCard size={32} />
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold">۴۵۰٫۰۰۰ <span className="text-sm font-medium text-slate-400">ریال عمان</span></p>
                <p className="text-slate-500 text-sm">شامل ۵٪ مالیات بر ارزش افزوده</p>
              </div>
              <Button className="w-full h-14 rounded-2xl bg-[#1B5E3F] text-lg font-bold">پرداخت آنلاین</Button>
              <div className="flex items-center justify-center gap-4 grayscale opacity-50">
                <div className="h-6 w-12 bg-slate-200 rounded"></div>
                <div className="h-6 w-12 bg-slate-200 rounded"></div>
                <div className="h-6 w-12 bg-slate-200 rounded"></div>
              </div>
            </div>
            <p className="text-xs text-slate-400">تراکنش با رمزنگاری ۲۵۶ بیتی امن شده است</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 rtl fa">
      <div className="mb-12">
        <div className="flex justify-between items-end mb-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">ثبت شرکت</h1>
            <p className="text-slate-500 text-sm font-medium">مرحله {data.step} از ۱۰</p>
          </div>
          <div className="text-sm font-bold text-[#1B5E3F]">
            {Math.round(progress)}٪ تکمیل
          </div>
        </div>
        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-[#1B5E3F] rounded-full transition-all duration-500 ease-out shadow-[0_0_15px_rgba(27,94,63,0.3)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Card className="glass-card rounded-3xl overflow-hidden border-2">
        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={data.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={data.step === 1}
              className="rounded-xl h-14 px-8 font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ArrowRight className="ml-2" size={20} />
              قبلی
            </Button>

            <Button
              onClick={nextStep}
              className="bg-[#1B5E3F] text-white hover:bg-[#1B5E3F]/90 h-14 px-12 rounded-2xl font-bold shadow-xl shadow-[#1B5E3F]/25 transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              {data.step === 10 ? 'پرداخت نهایی' : 'بعدی'}
              <ArrowLeft className="mr-2" size={20} />
            </Button>
          </div>
        </div>
      </Card>

      <footer className="mt-12 flex items-center justify-between text-[11px] text-slate-400 font-bold tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>سیستم آنلاین</span>
        </div>
        <div className="flex gap-4">
          <span>حریم خصوصی</span>
          <span>شرایط استفاده</span>
          <span className="text-[#1B5E3F] italic underline underline-offset-4 decoration-[#D4A574] px-2">تأیید شده توسط MOCIIP</span>
        </div>
      </footer>
    </div>
  );
};

export default RegistrationWizard;

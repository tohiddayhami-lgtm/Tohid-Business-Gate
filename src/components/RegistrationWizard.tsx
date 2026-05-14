import React, { useState } from 'react';
import { useWizardStore } from '@/src/store/useWizardStore';
import { useTranslation } from '@/src/hooks/useLocale';
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
import { Building2, Globe, FileText, Users, DollarSign, Upload, CheckCircle2, CreditCard, ArrowRight, ArrowLeft, Sparkles, Search } from 'lucide-react';

const RegistrationWizard = () => {
  const { data, updateData } = useWizardStore();
  const { t, isRtl } = useTranslation();
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
      toast.error("AI service error");
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
              <CardTitle className="text-2xl font-bold">{t('Step 1: Choose Business Structure')}</CardTitle>
              <CardDescription>Select the legal entity type for your Omani company.</CardDescription>
            </CardHeader>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { id: 'LLC', title: 'LLC', desc: 'Limited Liability Company - min 2 shareholders', icon: Building2 },
                { id: 'SPC', title: 'SPC', desc: 'Single Person Company - Solo entrepreneur', icon: Users },
                { id: 'BRANCH', title: 'Branch Office', desc: 'Foreign company expansion', icon: Globe },
                { id: 'REP_OFFICE', title: 'Representative Office', desc: 'Market research only', icon: FileText },
              ].map((item) => (
                <Card 
                  key={item.id}
                  className={`cursor-pointer border-2 transition-all hover:shadow-lg ${data.structure === item.id ? 'border-primary bg-primary/5' : 'border-slate-100'}`}
                  onClick={() => updateData({ structure: item.id })}
                >
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className={`p-3 rounded-2xl ${data.structure === item.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
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
              <CardTitle className="text-2xl font-bold">Step 2: Choose Jurisdiction</CardTitle>
              <CardDescription>Choose between Mainland Oman or a Free Zone.</CardDescription>
            </CardHeader>
            <Tabs 
              value={data.jurisdiction} 
              onValueChange={(val) => updateData({ jurisdiction: val as any })}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100 rounded-2xl h-14">
                <TabsTrigger value="mainland" className="rounded-xl h-12 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Mainland</TabsTrigger>
                <TabsTrigger value="freezone" className="rounded-xl h-12 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Free Zone</TabsTrigger>
              </TabsList>
              
              <TabsContent value="freezone" className="mt-8 space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {['Sohar Free Zone', 'Salalah Free Zone', 'Duqm SEZ', 'Al Mazunah', 'Knowledge Oasis Muscat'].map((zone) => (
                    <div 
                      key={zone}
                      onClick={() => updateData({ freeZone: zone })}
                      className={`p-4 border-2 rounded-2xl cursor-pointer flex items-center justify-between transition-all ${data.freeZone === zone ? 'border-primary bg-primary/5' : 'border-slate-100 hover:bg-slate-50'}`}
                    >
                      <span className="font-medium text-slate-800">{zone}</span>
                      {data.freeZone === zone && <CheckCircle2 className="text-primary" size={20} />}
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
                Step 3: Business Activity
                <Badge variant="secondary" className="bg-primary/10 text-primary">AI Powered</Badge>
              </CardTitle>
              <CardDescription>What will your company do? Describe it and we'll suggest activity codes.</CardDescription>
            </CardHeader>
            
            <div className="space-y-4">
              <div className="relative">
                <Label>Business Description</Label>
                <div className="flex gap-2 mt-2">
                  <Input 
                    placeholder="e.g. We will build mobile apps and provide IT consulting..." 
                    value={aiDescription}
                    onChange={(e) => setAiDescription(e.target.value)}
                    className="rounded-xl h-12"
                  />
                  <Button 
                    onClick={handleSuggest} 
                    disabled={loading || !aiDescription}
                    className="rounded-xl h-12 bg-primary hover:bg-primary/90"
                  >
                    {loading ? "..." : <Sparkles size={20} />}
                  </Button>
                </div>
              </div>

              {suggestions.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Suggested Activities</p>
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
              <CardTitle className="text-2xl font-bold">Step 4: Trade Name Reservation</CardTitle>
              <CardDescription>Suggest 3 names in order of preference.</CardDescription>
            </CardHeader>
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs uppercase font-bold text-slate-400">Arabic Name {i + 1}</Label>
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
                    <Label className="text-xs uppercase font-bold text-slate-400">English Name {i + 1}</Label>
                    <Input 
                      placeholder="English Name" 
                      className="mt-1"
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
              <CardTitle className="text-2xl font-bold">Step 5: Shareholders & Capital</CardTitle>
              <CardDescription>Define ownership and investment.</CardDescription>
            </CardHeader>
            <div className="space-y-6">
              <div>
                <Label>Minimum Capital (OMR)</Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    type="number" 
                    className="pl-10 h-12 rounded-xl"
                    value={data.capital}
                    onChange={(e) => updateData({ capital: Number(e.target.value) })}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="font-bold">Shareholders</Label>
                  <Button variant="outline" size="sm" onClick={() => updateData({ shareholders: [...data.shareholders, { name: '', nationality: 'Oman', passportNumber: '', equity: 0 }] })}>+ Add</Button>
                </div>
                {data.shareholders.map((sh, i) => (
                  <Card key={i} className="p-4 border-slate-100 shadow-sm rounded-2xl relative">
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="Full Name" value={sh.name} onChange={(e) => {
                        const next = [...data.shareholders];
                        next[i].name = e.target.value;
                        updateData({ shareholders: next });
                      }} />
                      <Input placeholder="Nationality" value={sh.nationality} onChange={(e) => {
                        const next = [...data.shareholders];
                        next[i].nationality = e.target.value;
                        updateData({ shareholders: next });
                      }} />
                      <Input placeholder="Passport #" value={sh.passportNumber} onChange={(e) => {
                        const next = [...data.shareholders];
                        next[i].passportNumber = e.target.value;
                        updateData({ shareholders: next });
                      }} />
                      <Input type="number" placeholder="Equity %" value={sh.equity} onChange={(e) => {
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
              <CardTitle className="text-2xl font-bold">Step 6: Document Upload</CardTitle>
              <CardDescription>Upload necessary IDs and records.</CardDescription>
            </CardHeader>
            <div className="grid gap-4">
              {[
                { label: 'Passport Copy', required: true },
                { label: 'Passport Photo', required: true },
                { label: 'Bank Statement', required: false },
                { label: 'Educational Certificates', required: false },
              ].map((doc) => (
                <div key={doc.label} className="p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:border-primary/50 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors"><Upload size={20} /></div>
                      <div>
                        <p className="font-bold">{doc.label}</p>
                        <p className="text-xs text-slate-400">{doc.required ? 'Required' : 'Optional'}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Select File</Button>
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
              <CardTitle className="text-2xl font-bold">Step 7: MoA Drafting</CardTitle>
              <CardDescription>Preview your Memorandum of Association.</CardDescription>
            </CardHeader>
            <Card className="bg-slate-50 border-slate-200 p-8 font-serif leading-relaxed text-slate-800">
               <h3 className="text-center font-bold text-lg mb-4">MEMORANDUM OF ASSOCIATION</h3>
               <p className="mb-2">This company shall be known as <strong>{data.tradeNames[0]?.en || "[TRADE NAME]"}</strong>.</p>
               <p className="mb-2">The company structure is <strong>{data.structure || "[STRUCTURE]"}</strong>.</p>
               <p className="mb-2">The primary activities include <strong>{data.activities.join(', ') || "[ACTIVITIES]"}</strong>.</p>
               <div className="mt-8 border-t pt-4">
                  <p className="text-xs text-slate-400 italic">This is an auto-generated draft based on your inputs.</p>
               </div>
            </Card>
          </div>
        );
      case 8:
        return (
          <div className="space-y-6">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold">Step 8: Additional Approvals</CardTitle>
              <CardDescription>Self-declare mandatory registrations.</CardDescription>
            </CardHeader>
            <div className="space-y-4">
              {[
                { id: 'tax', label: 'Tax Registration (Automatic)', desc: 'Register for VAT and Corporate Tax' },
                { id: 'pasi', label: 'PASI Registration', desc: 'Social Insurance for employees' },
                { id: 'municipality', label: 'Municipality License', desc: 'Local Baladiya approval' },
                { id: 'occi', label: 'OCCI Membership', desc: 'Oman Chamber of Commerce' },
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
              <CardTitle className="text-3xl font-bold text-primary">Ready to Submit?</CardTitle>
              <CardDescription>Review all details before finalizing.</CardDescription>
            </CardHeader>
            <div className="grid md:grid-cols-2 gap-6 pb-6 border-b">
               <div className="space-y-1">
                  <Label className="text-slate-400">Structure</Label>
                  <p className="font-bold text-lg">{data.structure}</p>
               </div>
               <div className="space-y-1">
                  <Label className="text-slate-400">Jurisdiction</Label>
                  <p className="font-bold text-lg">{data.jurisdiction === 'mainland' ? 'Mainland' : data.freeZone}</p>
               </div>
               <div className="space-y-1">
                  <Label className="text-slate-400">Primary Activities</Label>
                  <p className="font-bold">{data.activities.slice(0,2).join(', ')}</p>
               </div>
               <div className="space-y-1">
                  <Label className="text-slate-400">Capital</Label>
                  <p className="font-bold text-lg">{data.capital.toLocaleString()} OMR</p>
               </div>
            </div>
            <div className="flex justify-between items-center py-4 text-xl font-bold">
               <span>Total Service Fees</span>
               <span className="text-primary text-2xl">OMR 450.000</span>
            </div>
          </div>
        );
      case 10:
        return (
          <div className="space-y-8 text-center">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold">Final Step: Secure Payment</CardTitle>
              <CardDescription>Pay government and service fees via Thawani/OmanNet.</CardDescription>
            </CardHeader>
            <div className="max-w-sm mx-auto p-8 border-2 border-slate-100 rounded-[2.5rem] space-y-6">
               <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                 <CreditCard size={32} />
               </div>
               <div className="space-y-2">
                 <p className="text-3xl font-bold">450.000 <span className="text-sm font-medium text-slate-400">OMR</span></p>
                 <p className="text-slate-500 text-sm">Including 5% VAT</p>
               </div>
               <Button className="w-full h-14 rounded-2xl bg-primary text-lg font-bold">Pay with Stripe</Button>
               <div className="flex items-center justify-center gap-4 grayscale opacity-50">
                  <div className="h-6 w-12 bg-slate-200 rounded"></div>
                  <div className="h-6 w-12 bg-slate-200 rounded"></div>
                  <div className="h-6 w-12 bg-slate-200 rounded"></div>
               </div>
            </div>
            <p className="text-xs text-slate-400">Secure 256-bit encrypted transaction</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 py-12 ${isRtl ? 'rtl fa' : 'ltr en'}`}>
      <div className="mb-12">
        <div className="flex justify-between items-end mb-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{t('company_reg')}</h1>
            <p className="text-slate-500 text-sm font-medium">{t('step')} {data.step} of 10</p>
          </div>
          <div className="text-sm font-bold text-primary">
            {Math.round(progress)}% Complete
          </div>
        </div>
        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out shadow-[0_0_15px_rgba(27,94,63,0.3)]" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Card className="glass-card rounded-3xl overflow-hidden border-2">
        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={data.step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
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
              <ArrowLeft className={isRtl ? "ml-2" : "mr-2"} size={20} />
              {t('back')}
            </Button>
            
            <Button 
              onClick={nextStep}
              className="bg-primary text-white hover:bg-primary/90 h-14 px-12 rounded-2xl font-bold shadow-xl shadow-primary/25 transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              {data.step === 10 ? (isRtl ? 'پرداخت نهایی' : 'Complete Payment') : t('next')}
              <ArrowRight className={isRtl ? "mr-2 rotate-180" : "ml-2"} size={20} />
            </Button>
          </div>
        </div>
      </Card>

      <footer className="mt-12 flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>System Online</span>
        </div>
        <div className="flex gap-4">
          <span>Privacy</span>
          <span>Terms</span>
          <span className="text-primary italic underline underline-offset-4 decoration-secondary px-2">Approved by MOCIIP</span>
        </div>
      </footer>
    </div>
  );
};

export default RegistrationWizard;

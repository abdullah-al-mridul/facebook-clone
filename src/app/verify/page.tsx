
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, ShieldCheck, UploadCloud, User, MapPin, FileCheck } from 'lucide-react';
import Image from 'next/image';

const steps = [
  { id: '01', name: 'Personal Information', fields: ['fullName', 'dob'] },
  { id: '02', name: 'Location Details', fields: ['country', 'address'] },
  { id: '03', name: 'Upload Document', fields: ['documentType', 'documentPhoto'] },
  { id: '04', name: 'Confirmation', fields: [] },
];

const countryList = ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Japan"];

export default function VerificationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    country: '',
    address: '',
    documentType: '',
    documentPhoto: null as File | null,
    documentPhotoPreview: null as string | null,
  });
  const [direction, setDirection] = useState(1);

  const handleNext = () => {
    setDirection(1);
    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'documentPhoto' && files) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        documentPhoto: file,
        documentPhotoPreview: URL.createObjectURL(file),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const progress = useMemo(() => {
    const totalFields = steps.flatMap(s => s.fields).length;
    let completedFields = 0;
    for (const key in formData) {
      if (formData[key as keyof typeof formData]) {
        completedFields++;
      }
    }
    return (completedFields / totalFields) * 100;
  }, [formData]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-zinc-950 p-4 transition-colors">
      <Card className="w-full max-w-lg shadow-2xl border-primary/20 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold text-center">
              Account Verification
            </CardTitle>
          </div>
          <CardDescription className="text-center">
            Complete the steps to get your account verified.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="px-6 mb-8">
            <Progress value={progress} className="w-full h-2" />
            <div className="flex justify-between mt-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center border-2 ${
                      currentStep > index ? 'bg-primary border-primary text-primary-foreground' : currentStep === index ? 'border-primary' : 'border-border'
                    }`}
                  >
                    {currentStep > index ? <Check className="h-4 w-4" /> : <span className='text-xs'>{step.id}</span>}
                  </div>
                  <p className={`text-xs mt-1 ${currentStep >= index ? 'text-foreground' : 'text-muted-foreground'}`}>{step.name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden relative h-64">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'tween', duration: 0.3 }}
                className="absolute w-full"
              >
                {currentStep === 0 && (
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                      </div>
                  </div>
                )}
                {currentStep === 1 && (
                   <div className="space-y-4">
                     <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select name="country" onValueChange={(value) => handleSelectChange('country', value)} defaultValue={formData.country}>
                        <SelectTrigger id="country"><SelectValue placeholder="Select your country" /></SelectTrigger>
                        <SelectContent>
                          {countryList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                     </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Full Address</Label>
                        <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St, Anytown, USA" />
                      </div>
                   </div>
                )}
                 {currentStep === 2 && (
                   <div className="space-y-4">
                     <div className="space-y-2">
                      <Label htmlFor="documentType">Document Type</Label>
                      <Select name="documentType" onValueChange={(value) => handleSelectChange('documentType', value)} defaultValue={formData.documentType}>
                        <SelectTrigger id="documentType"><SelectValue placeholder="Select document type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="id_card">National ID Card</SelectItem>
                          <SelectItem value="drivers_license">Driver's License</SelectItem>
                        </SelectContent>
                      </Select>
                     </div>
                      <div className="space-y-2">
                        <Label>Upload Photo</Label>
                         <label htmlFor="documentPhoto" className="cursor-pointer">
                            <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg hover:bg-accent h-32">
                               {formData.documentPhotoPreview ? (
                                <Image src={formData.documentPhotoPreview} alt="document preview" width={100} height={60} className="object-contain"/>
                               ) : (
                                <>
                                 <UploadCloud className="h-8 w-8 text-muted-foreground" />
                                 <p className="text-sm text-muted-foreground mt-2">Click to upload document</p>
                                </>
                               )}
                            </div>
                         </label>
                        <Input id="documentPhoto" name="documentPhoto" type="file" onChange={handleChange} className="hidden" accept="image/*" />
                      </div>
                   </div>
                 )}
                 {currentStep === 3 && (
                    <div className="text-center p-4">
                        <div className="flex justify-center items-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
                            >
                                <Check className="h-16 w-16 text-green-500 bg-green-500/10 rounded-full p-2"/>
                            </motion.div>
                        </div>
                        <h3 className="text-xl font-semibold mt-4">Thank you!</h3>
                        <p className="text-muted-foreground mt-2">Your verification request has been submitted. We will review your information and notify you within 3-5 business days.</p>
                    </div>
                 )}
              </motion.div>
            </AnimatePresence>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          {currentStep > 0 && currentStep < steps.length - 1 && (
             <Button variant="outline" onClick={handlePrev}>
              <ArrowLeft className="mr-2" /> Previous
            </Button>
          )}
          {currentStep < steps.length - 2 && (
            <Button onClick={handleNext} className="ml-auto">Next</Button>
          )}
           {currentStep === steps.length - 2 && (
            <Button onClick={handleNext} className="ml-auto bg-green-600 hover:bg-green-700">
                Submit for Verification
            </Button>
          )}
          {currentStep === steps.length - 1 && (
             <Button onClick={() => {}} className="w-full">Back to Profile</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, DollarSign, Calendar, MapPin, Clock, Wand2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { JOB_CATEGORIES, TIMELINE_OPTIONS, SKILLS, ROUTES } from '@/lib/constants';
import { toast } from '@/store/uiStore';
import { cn } from '@/lib/utils';
import { jobsApi } from '@/lib/api';

interface PostJobForm {
  title: string;
  category: string;
  description: string;
  budget: number;
  timeline: string;
  location: string;
  startDate?: string;
}

const steps = [
  { id: 1, title: 'Job Details', desc: 'What needs to be done?' },
  { id: 2, title: 'Requirements', desc: 'Budget & timeline' },
  { id: 3, title: 'Review', desc: 'Confirm & post' },
];

export default function PostJobPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState(false);

  const {
    register, handleSubmit, watch, setValue,
    formState: { errors },
  } = useForm<PostJobForm>();

  const values = watch();

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAiEstimate = async () => {
    setAiSuggesting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setValue('budget', 18500);
    setValue('timeline', '4 weeks');
    setAiSuggesting(false);
    toast.success('AI Estimate Ready', 'Budget and timeline estimated based on your project details.');
  };

  const onSubmit = async (data: PostJobForm) => {
    if (step < 3) {
      setStep((s) => s + 1);
      return;
    }
    setSubmitting(true);
    try {
      await jobsApi.create({
        title: data.title,
        description: data.description,
        category: data.category,
        budget: Number(data.budget),
        location: data.location,
        startDate: data.startDate || undefined,
        skills: selectedSkills,
      });
      toast.success('Job posted!', 'Contractors will start bidding soon.');
      router.push(ROUTES.MY_JOBS);
    } catch (err: any) {
      toast.error('Failed to post job', err?.response?.data?.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => (step > 1 ? setStep((s) => s - 1) : router.back())}
          className="p-2 rounded-lg text-dark-500 hover:text-dark-800 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="page-title">Post a New Job</h1>
          <p className="page-subtitle">Tell contractors what you need done</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <div
              className={cn(
                'flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                step === s.id
                  ? 'bg-brand-500 text-white'
                  : step > s.id
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-gray-100 text-dark-400'
              )}
            >
              <span className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                step === s.id ? 'bg-white/20 text-white' : step > s.id ? 'bg-green-200 text-green-800' : 'bg-gray-300 text-gray-600'
              )}>
                {step > s.id ? '✓' : s.id}
              </span>
              <span className="hidden sm:block">{s.title}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn('flex-1 h-px', step > s.id ? 'bg-green-300' : 'bg-gray-200')} />
            )}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Job Details */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="form-section">
              <h2 className="form-section-title">Describe the Job</h2>

              <Input
                label="Job Title"
                placeholder="e.g., Kitchen Renovation - Modern Open Plan"
                error={errors.title?.message}
                hint="Be specific to attract the right contractors"
                {...register('title', { required: 'Title is required', minLength: { value: 10, message: 'At least 10 characters' } })}
              />

              <Select
                label="Category"
                placeholder="Select a category"
                options={JOB_CATEGORIES.map((c) => ({ label: c, value: c }))}
                error={errors.category?.message}
                {...register('category', { required: 'Category is required' })}
              />

              <Textarea
                label="Job Description"
                placeholder="Describe the work in detail: scope, materials, special requirements, access, etc."
                rows={8}
                error={errors.description?.message}
                hint="More detail = better bids"
                {...register('description', { required: 'Description is required', minLength: { value: 50, message: 'At least 50 characters' } })}
              />
            </div>

            <div className="form-section">
              <h2 className="form-section-title">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150',
                      selectedSkills.includes(skill)
                        ? 'bg-brand-500 text-white border-brand-500'
                        : 'bg-white text-dark-600 border-gray-200 hover:border-brand-300 hover:text-brand-600'
                    )}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {selectedSkills.length > 0 && (
                <p className="text-xs text-dark-400 mt-2">{selectedSkills.length} skill(s) selected</p>
              )}
            </div>

            <div className="form-section">
              <h2 className="form-section-title">Job Photos (Optional)</h2>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-brand-300 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-dark-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-dark-600">Drop photos here or click to upload</p>
                <p className="text-xs text-dark-400 mt-1">PNG, JPG up to 10MB each</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Requirements */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="form-section">
              <div className="flex items-center justify-between">
                <h2 className="form-section-title">Budget & Timeline</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  leftIcon={<Wand2 className="w-3.5 h-3.5" />}
                  loading={aiSuggesting}
                  onClick={handleAiEstimate}
                  disabled={!values.description || values.description.length < 20}
                >
                  AI Estimate
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Budget (USD)"
                  type="number"
                  placeholder="e.g. 15000"
                  leftIcon={<DollarSign className="w-4 h-4" />}
                  error={errors.budget?.message}
                  hint="Enter your maximum budget"
                  {...register('budget', {
                    required: 'Budget is required',
                    min: { value: 100, message: 'Minimum $100' },
                  })}
                />

                <Select
                  label="Project Timeline"
                  placeholder="Select timeline"
                  options={TIMELINE_OPTIONS.map((t) => ({ label: t, value: t }))}
                  error={errors.timeline?.message}
                  {...register('timeline', { required: 'Timeline is required' })}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Project Location"
                  placeholder="City, State"
                  leftIcon={<MapPin className="w-4 h-4" />}
                  error={errors.location?.message}
                  {...register('location', { required: 'Location is required' })}
                />

                <Input
                  label="Preferred Start Date"
                  type="date"
                  leftIcon={<Calendar className="w-4 h-4" />}
                  {...register('startDate')}
                />
              </div>
            </div>

            {values.budget && (
              <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
                <p className="text-sm font-semibold text-brand-800 mb-1">
                  💡 Budget Insights
                </p>
                <p className="text-xs text-brand-700">
                  For a {values.category || 'general construction'} project with a budget of{' '}
                  <strong>${Number(values.budget).toLocaleString()}</strong>, you can expect to receive{' '}
                  <strong>5–15 competitive bids</strong> from qualified contractors in your area.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-5">
            <Card padding="md">
              <h2 className="form-section-title">Review Your Job Posting</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-dark-400 uppercase tracking-wider font-medium mb-1">Title</p>
                  <p className="font-semibold text-dark-900">{values.title || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-400 uppercase tracking-wider font-medium mb-1">Category</p>
                  <p className="text-dark-800">{values.category || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-400 uppercase tracking-wider font-medium mb-1">Description</p>
                  <p className="text-dark-700 text-sm leading-relaxed">{values.description || '—'}</p>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-dark-400 font-medium">Budget</p>
                    <p className="font-bold text-dark-900">${Number(values.budget || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-dark-400 font-medium">Timeline</p>
                    <p className="font-bold text-dark-900">{values.timeline || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-dark-400 font-medium">Location</p>
                    <p className="font-bold text-dark-900">{values.location || '—'}</p>
                  </div>
                </div>
                {selectedSkills.length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-dark-400 font-medium mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSkills.map((s) => (
                        <span key={s} className="px-2.5 py-0.5 bg-brand-50 text-brand-700 text-xs rounded-full font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              ⚠️ By posting, your job will be visible to all verified contractors in your area. You&apos;ll receive an email notification for each new bid.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          ) : (
            <div />
          )}
          <Button type="submit" loading={submitting && step === 3}>
            {step < 3 ? 'Continue' : 'Post Job'}
          </Button>
        </div>
      </form>
    </div>
  );
}

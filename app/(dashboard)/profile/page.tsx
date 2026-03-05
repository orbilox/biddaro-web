'use client';
import React, { useEffect, useState } from 'react';
import { Camera, MapPin, Phone, Globe, CheckCircle, Edit3, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { StarRating } from '@/components/shared/StarRating';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/uiStore';
import { usersApi, reviewsApi } from '@/lib/api';
import { SKILLS } from '@/lib/constants';
import type { Review } from '@/types';

interface FormState {
  firstName: string;
  lastName: string;
  bio: string;
  phone: string;
  location: string;
  skills: string[];
}

const parseSkills = (raw: string | string[] | undefined): string[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return [raw]; }
};

export default function ProfilePage() {
  const { user, setUser, token } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [newSkill, setNewSkill] = useState('');

  const makeForm = (): FormState => ({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    location: user?.location || '',
    skills: parseSkills(user?.skills),
  });

  const [form, setForm] = useState<FormState>(makeForm);

  useEffect(() => {
    setForm(makeForm());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    Promise.allSettled([
      reviewsApi.forUser(user.id),
      usersApi.myStats(),
    ]).then(([reviewsRes, statsRes]) => {
      if (reviewsRes.status === 'fulfilled') {
        const d = reviewsRes.value.data.data;
        setReviews(d.reviews || d || []);
      }
      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data.data);
      }
    });
  }, [user?.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        firstName: form.firstName,
        lastName: form.lastName,
        bio: form.bio,
        phone: form.phone,
        location: form.location,
        skills: JSON.stringify(form.skills),
      };
      const res = await usersApi.update(payload);
      const updatedUser = res.data.data;
      setUser(updatedUser, token || '');
      setEditing(false);
      toast.success('Profile updated', 'Your changes have been saved.');
    } catch (err: any) {
      toast.error('Update failed', err?.response?.data?.message || 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(makeForm());
    setEditing(false);
  };

  const addSkill = (skill: string) => {
    if (skill && !form.skills.includes(skill)) {
      setForm((f) => ({ ...f, skills: [...f.skills, skill] }));
    }
    setNewSkill('');
  };

  const removeSkill = (skill: string) => {
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));
  };

  const displaySkills = editing ? form.skills : parseSkills(user?.skills);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Manage your public profile</p>
        </div>
        {!editing ? (
          <Button variant="outline" onClick={() => setEditing(true)}>
            <Edit3 className="w-4 h-4 mr-1.5" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>Save Changes</Button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Profile card */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="relative inline-block mb-4">
              <Avatar
                src={user?.profileImage}
                firstName={user?.firstName}
                lastName={user?.lastName}
                size="xl"
              />
              {editing && (
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center text-white shadow-md">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <h2 className="text-xl font-bold text-dark-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-sm text-dark-400 mb-3 capitalize">
              {user?.role?.replace('_', ' ')}
            </p>

            <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
              {user?.rating ? (
                <StarRating rating={user.rating} showValue size="sm" count={stats?.reviewCount} />
              ) : null}
              {user?.isVerified && (
                <Badge variant="success" size="sm">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              <div>
                <p className="text-lg font-bold text-dark-900">{stats?.jobsCompleted ?? '—'}</p>
                <p className="text-xs text-dark-400">Jobs Done</p>
              </div>
              <div>
                <p className="text-lg font-bold text-dark-900">{reviews.length}</p>
                <p className="text-xs text-dark-400">Reviews</p>
              </div>
              <div>
                <p className="text-lg font-bold text-dark-900">{user?.rating?.toFixed(1) ?? '—'}</p>
                <p className="text-xs text-dark-400">Rating</p>
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-dark-900 mb-3 text-sm">Contact & Location</h3>
            <div className="space-y-2.5 text-sm text-dark-600">
              {user?.location && (
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-dark-400 flex-shrink-0" />
                  <span>{user.location}</span>
                </div>
              )}
              {user?.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-dark-400 flex-shrink-0" />
                  <span>{user.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-dark-400 flex-shrink-0" />
                <span className="text-dark-500 text-xs truncate">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabList>
              <Tab value="overview">Overview</Tab>
              {editing && <Tab value="edit">Edit Info</Tab>}
              <Tab value="reviews" count={reviews.length}>Reviews</Tab>
            </TabList>

            <div className="mt-5">
              {/* Overview */}
              <TabPanel value="overview">
                <div className="space-y-5">
                  {user?.bio && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <h3 className="font-semibold text-dark-900 mb-3 text-sm">About</h3>
                      <p className="text-sm text-dark-600 leading-relaxed">{user.bio}</p>
                    </div>
                  )}

                  {displaySkills.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <h3 className="font-semibold text-dark-900 mb-3 text-sm">Skills & Specializations</h3>
                      <div className="flex flex-wrap gap-2">
                        {displaySkills.map((skill) => (
                          <Badge key={skill} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {stats?.totalEarned !== undefined && (
                      <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <p className="text-xs text-dark-400 mb-1">Total Earned</p>
                        <p className="text-2xl font-bold text-dark-900">{formatCurrency(stats.totalEarned)}</p>
                      </div>
                    )}
                    {stats?.jobsCompleted !== undefined && (
                      <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <p className="text-xs text-dark-400 mb-1">Jobs Completed</p>
                        <p className="text-2xl font-bold text-dark-900">{stats.jobsCompleted}</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabPanel>

              {/* Edit */}
              <TabPanel value="edit">
                {editing && (
                  <div className="space-y-5">
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <h3 className="font-semibold text-dark-900 mb-4 text-sm">Personal Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="First Name"
                          value={form.firstName}
                          onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                        />
                        <Input
                          label="Last Name"
                          value={form.lastName}
                          onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <Input
                          label="Phone"
                          value={form.phone}
                          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                          leftIcon={<Phone className="w-4 h-4" />}
                        />
                        <Input
                          label="Location"
                          value={form.location}
                          onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                          leftIcon={<MapPin className="w-4 h-4" />}
                        />
                      </div>
                      <div className="mt-4">
                        <Textarea
                          label="Bio"
                          value={form.bio}
                          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                          rows={4}
                          hint="Highlight your experience and specializations."
                        />
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <h3 className="font-semibold text-dark-900 mb-4 text-sm">Skills</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {form.skills.map((skill) => (
                          <span
                            key={skill}
                            className="flex items-center gap-1 bg-gray-100 text-dark-700 text-xs font-medium px-3 py-1.5 rounded-full"
                          >
                            {skill}
                            <button onClick={() => removeSkill(skill)} className="ml-1 text-dark-400 hover:text-red-500">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Select
                          options={SKILLS.filter((s) => !form.skills.includes(s)).map((s) => ({ value: s, label: s }))}
                          placeholder="Add a skill..."
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                        />
                        <Button variant="outline" size="sm" onClick={() => addSkill(newSkill)} disabled={!newSkill}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </TabPanel>

              {/* Reviews */}
              <TabPanel value="reviews">
                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-dark-400 text-sm">No reviews yet.</div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar
                              firstName={review.reviewer?.firstName}
                              lastName={review.reviewer?.lastName}
                              size="sm"
                            />
                            <div>
                              <p className="text-sm font-semibold text-dark-900">
                                {review.reviewer?.firstName} {review.reviewer?.lastName}
                              </p>
                              <p className="text-xs text-dark-400">{timeAgo(review.createdAt)}</p>
                            </div>
                          </div>
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                        {review.comment && (
                          <p className="text-sm text-dark-600 leading-relaxed">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabPanel>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

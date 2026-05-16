/**
 * Biddaro GA4 Analytics — Custom Event Tracking
 * Measurement ID: G-DCZLVPPVF2
 *
 * Usage: import { track } from '@/lib/analytics'
 *        track.signUp({ method: 'email', role: 'contractor' })
 */

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const GA_ID = 'G-DCZLVPPVF2';

/** Low-level gtag event wrapper — safe to call SSR (no-ops on server) */
function gtag(event: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', event, { send_to: GA_ID, ...params });
}

// ─────────────────────────────────────────────────────────────────────────────
//  AUTH EVENTS
// ─────────────────────────────────────────────────────────────────────────────

/** User completed registration (OTP verified) */
function signUp(params: { method?: string; role: string; country?: string }) {
  gtag('sign_up', {
    method:  params.method || 'email',
    role:    params.role,
    country: params.country,
  });
}

/** User logged in successfully */
function login(params: { method?: string; role: string }) {
  gtag('login', {
    method: params.method || 'email',
    role:   params.role,
  });
}

/** User started registration form */
function beginRegistration() {
  gtag('begin_registration');
}

/** User requested OTP resend */
function otpResend(params: { email: string }) {
  gtag('otp_resend', { email_domain: params.email.split('@')[1] });
}

/** User submitted OTP to verify email */
function otpVerified() {
  gtag('otp_verified');
}

/** User requested forgot password */
function forgotPassword() {
  gtag('forgot_password');
}

/** User completed password reset */
function passwordReset() {
  gtag('password_reset');
}

/** User logged out */
function logout() {
  gtag('logout');
}

// ─────────────────────────────────────────────────────────────────────────────
//  JOB EVENTS
// ─────────────────────────────────────────────────────────────────────────────

/** Job poster created a new job listing */
function jobPosted(params: {
  category: string;
  budget: number;
  currency?: string;
  location?: string;
  projectType?: string;
}) {
  gtag('job_posted', {
    job_category:  params.category,
    value:         params.budget,
    currency:      params.currency || 'USD',
    job_location:  params.location,
    project_type:  params.projectType,
  });
}

/** User viewed a job listing */
function jobViewed(params: { jobId: string; category: string; budget: number; currency?: string }) {
  gtag('view_item', {
    item_id:      params.jobId,
    item_category: params.category,
    value:        params.budget,
    currency:     params.currency || 'USD',
  });
}

/** Contractor searched / filtered jobs */
function jobSearch(params: { search?: string; category?: string; location?: string }) {
  gtag('search', {
    search_term: params.search || '',
    job_category: params.category,
    location:    params.location,
  });
}

/** Contractor applied a filter on the find-work page */
function filterApplied(params: { filterType: string; filterValue: string }) {
  gtag('filter_applied', {
    filter_type:  params.filterType,
    filter_value: params.filterValue,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  BID EVENTS
// ─────────────────────────────────────────────────────────────────────────────

/** Contractor submitted a bid */
function bidSubmitted(params: {
  jobId: string;
  bidAmount: number;
  currency?: string;
  estimatedDays?: number;
  hasMilestones?: boolean;
}) {
  gtag('bid_submitted', {
    job_id:        params.jobId,
    value:         params.bidAmount,
    currency:      params.currency || 'USD',
    estimated_days: params.estimatedDays,
    has_milestones: params.hasMilestones,
  });
}

/** Job poster accepted a bid */
function bidAccepted(params: { jobId: string; bidAmount: number; currency?: string }) {
  gtag('bid_accepted', {
    job_id:   params.jobId,
    value:    params.bidAmount,
    currency: params.currency || 'USD',
  });
}

/** Contractor withdrew a bid */
function bidWithdrawn(params: { jobId: string }) {
  gtag('bid_withdrawn', { job_id: params.jobId });
}

/** Job poster opened bid insights modal */
function bidInsightsViewed(params: { jobId: string; totalBids: number }) {
  gtag('bid_insights_viewed', {
    job_id:    params.jobId,
    bid_count: params.totalBids,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  CONTRACT EVENTS
// ─────────────────────────────────────────────────────────────────────────────

/** Contract was created after bid acceptance */
function contractCreated(params: {
  contractId: string;
  totalAmount: number;
  currency?: string;
  milestoneCount?: number;
}) {
  gtag('contract_created', {
    contract_id:     params.contractId,
    value:           params.totalAmount,
    currency:        params.currency || 'USD',
    milestone_count: params.milestoneCount,
  });
}

/** Milestone marked as started by contractor */
function milestoneStarted(params: { contractId: string; milestoneIndex: number }) {
  gtag('milestone_started', {
    contract_id:     params.contractId,
    milestone_index: params.milestoneIndex,
  });
}

/** Contractor submitted proof / marked milestone complete */
function milestoneCompleted(params: {
  contractId: string;
  milestoneIndex: number;
  amount: number;
  currency?: string;
}) {
  gtag('milestone_completed', {
    contract_id:     params.contractId,
    milestone_index: params.milestoneIndex,
    value:           params.amount,
    currency:        params.currency || 'USD',
  });
}

/** Job poster approved a milestone */
function milestoneApproved(params: {
  contractId: string;
  milestoneIndex: number;
  amount: number;
  currency?: string;
}) {
  gtag('milestone_approved', {
    contract_id:     params.contractId,
    milestone_index: params.milestoneIndex,
    value:           params.amount,
    currency:        params.currency || 'USD',
  });
}

/** Full contract completed */
function contractCompleted(params: {
  contractId: string;
  totalAmount: number;
  currency?: string;
}) {
  gtag('contract_completed', {
    contract_id: params.contractId,
    value:       params.totalAmount,
    currency:    params.currency || 'USD',
  });
}

/** NOC certificate downloaded */
function nocDownloaded(params: { contractId: string }) {
  gtag('noc_downloaded', { contract_id: params.contractId });
}

// ─────────────────────────────────────────────────────────────────────────────
//  PAYMENT & WALLET EVENTS
// ─────────────────────────────────────────────────────────────────────────────

/** User initiated a wallet deposit */
function depositInitiated(params: { amount: number; currency?: string }) {
  gtag('deposit_initiated', {
    value:    params.amount,
    currency: params.currency || 'USD',
  });
}

/** User submitted a deposit request (bank transfer proof) */
function depositRequested(params: { amount: number; currency?: string }) {
  gtag('deposit_requested', {
    value:    params.amount,
    currency: params.currency || 'USD',
  });
}

/** User requested a withdrawal */
function withdrawalRequested(params: { amount: number; currency?: string }) {
  gtag('withdrawal_requested', {
    value:    params.amount,
    currency: params.currency || 'USD',
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  SUBSCRIPTION & PREMIUM EVENTS
// ─────────────────────────────────────────────────────────────────────────────

/** User viewed the subscription / pricing page */
function subscriptionPageViewed() {
  gtag('subscription_page_viewed');
}

/** User clicked subscribe on a plan */
function subscriptionStarted(params: {
  plan: string;
  billingCycle: string;
  value: number;
  currency?: string;
}) {
  gtag('begin_checkout', {
    plan:          params.plan,
    billing_cycle: params.billingCycle,
    value:         params.value,
    currency:      params.currency || 'USD',
    items: [{
      item_name: `Biddaro ${params.plan}`,
      item_category: 'subscription',
      price: params.value,
      quantity: 1,
    }],
  });
}

/** Stripe redirected back after successful subscription */
function subscriptionPurchased(params: {
  plan: string;
  billingCycle: string;
  value: number;
  currency?: string;
}) {
  gtag('purchase', {
    plan:          params.plan,
    billing_cycle: params.billingCycle,
    value:         params.value,
    currency:      params.currency || 'USD',
    transaction_id: `sub_${Date.now()}`,
    items: [{
      item_name: `Biddaro ${params.plan}`,
      item_category: 'subscription',
      price: params.value,
      quantity: 1,
    }],
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  PROFILE EVENTS
// ─────────────────────────────────────────────────────────────────────────────

/** User viewed a contractor's public profile */
function profileViewed(params: { profileUserId: string; role: string }) {
  gtag('profile_viewed', {
    profile_user_id: params.profileUserId,
    profile_role:    params.role,
  });
}

/** User saved/updated their profile */
function profileUpdated(params: { section: string }) {
  gtag('profile_updated', { section: params.section });
}

/** User uploaded a profile photo */
function profilePhotoUploaded() {
  gtag('profile_photo_uploaded');
}

// ─────────────────────────────────────────────────────────────────────────────
//  MESSAGING EVENTS
// ─────────────────────────────────────────────────────────────────────────────

/** User sent a message */
function messageSent(params: { hasJobContext?: boolean; hasContractContext?: boolean }) {
  gtag('message_sent', {
    has_job_context:      params.hasJobContext,
    has_contract_context: params.hasContractContext,
  });
}

/** User opened a conversation */
function conversationOpened() {
  gtag('conversation_opened');
}

// ─────────────────────────────────────────────────────────────────────────────
//  DISPUTE EVENTS
// ─────────────────────────────────────────────────────────────────────────────

/** User raised a dispute */
function disputeRaised(params: { contractId: string; reason: string }) {
  gtag('dispute_raised', {
    contract_id: params.contractId,
    reason:      params.reason,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  REFERRAL EVENTS
// ─────────────────────────────────────────────────────────────────────────────

/** User copied their referral link */
function referralLinkCopied() {
  gtag('referral_link_copied');
}

/** User tapped the native share button on the referral page */
function referralLinkShared() {
  gtag('referral_link_shared');
}

/** New user registered using a referral code */
function referralUsed(params: { referralCode: string }) {
  gtag('referral_used', { referral_code: params.referralCode });
}

// ─────────────────────────────────────────────────────────────────────────────
//  ADDON EVENTS
// ─────────────────────────────────────────────────────────────────────────────

/** User installed an add-on */
function addonInstalled(params: { slug: string; price: number }) {
  gtag('addon_installed', { addon_slug: params.slug, value: params.price });
}

/** User uninstalled an add-on */
function addonUninstalled(params: { slug: string }) {
  gtag('addon_uninstalled', { addon_slug: params.slug });
}

// ─────────────────────────────────────────────────────────────────────────────
//  LOAN EVENTS
// ─────────────────────────────────────────────────────────────────────────────

/** User started a loan application */
function loanApplicationStarted(params: { loanType: string; amount: number }) {
  gtag('loan_application_started', {
    loan_type: params.loanType,
    value:     params.amount,
  });
}

/** User submitted a loan application */
function loanApplicationSubmitted(params: {
  loanType: string;
  amount: number;
  tenure: number;
}) {
  gtag('loan_application_submitted', {
    loan_type: params.loanType,
    value:     params.amount,
    tenure:    params.tenure,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  ENGAGEMENT EVENTS
// ─────────────────────────────────────────────────────────────────────────────

/** User viewed the investors / pitch page */
function investorsPageViewed() {
  gtag('investors_page_viewed');
}

/** User clicked a CTA on the homepage */
function ctaClicked(params: { ctaLabel: string; location: string }) {
  gtag('cta_clicked', {
    cta_label:    params.ctaLabel,
    cta_location: params.location,
  });
}

/** User clicked "Contact Us" and submitted form */
function contactFormSubmitted(params: { subject?: string }) {
  gtag('contact_form_submitted', { subject: params.subject });
}

/** Clarification request asked within a contract */
function clarificationAsked(params: { contractId: string }) {
  gtag('clarification_asked', { contract_id: params.contractId });
}

/** Build plan created */
function buildPlanCreated(params: { buildType: string }) {
  gtag('build_plan_created', { build_type: params.buildType });
}

/** PM project created */
function pmProjectCreated() {
  gtag('pm_project_created');
}

// ─────────────────────────────────────────────────────────────────────────────
//  EXPORTED TRACK OBJECT
// ─────────────────────────────────────────────────────────────────────────────

export const track = {
  // Auth
  signUp,
  login,
  beginRegistration,
  otpResend,
  otpVerified,
  forgotPassword,
  passwordReset,
  logout,

  // Jobs
  jobPosted,
  jobViewed,
  jobSearch,
  filterApplied,

  // Bids
  bidSubmitted,
  bidAccepted,
  bidWithdrawn,
  bidInsightsViewed,

  // Contracts
  contractCreated,
  milestoneStarted,
  milestoneCompleted,
  milestoneApproved,
  contractCompleted,
  nocDownloaded,

  // Payments & Wallet
  depositInitiated,
  depositRequested,
  withdrawalRequested,

  // Subscription
  subscriptionPageViewed,
  subscriptionStarted,
  subscriptionPurchased,

  // Profile
  profileViewed,
  profileUpdated,
  profilePhotoUploaded,

  // Messaging
  messageSent,
  conversationOpened,

  // Disputes
  disputeRaised,

  // Referral
  referralLinkCopied,
  referralLinkShared,
  referralUsed,

  // Add-ons
  addonInstalled,
  addonUninstalled,

  // Loans
  loanApplicationStarted,
  loanApplicationSubmitted,

  // Engagement
  investorsPageViewed,
  ctaClicked,
  contactFormSubmitted,
  clarificationAsked,
  buildPlanCreated,
  pmProjectCreated,
};

"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Share2, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { useSettings } from '@/components/providers/SettingsProvider';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactSection() {
  const { settings, isLoading: settingsLoading } = useSettings();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Validation logic
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value || value.trim().length < 2) {
          return 'Name must be at least 2 characters';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'subject':
        if (!value || value.trim().length < 2) {
          return 'Subject is required';
        }
        break;
      case 'message':
        if (!value || value.trim().length < 10) {
          return 'Message must be at least 10 characters';
        }
        break;
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTouched({});
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitStatus('idle');
    setErrorMessage('');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setErrors({});
    setTouched({});
  };

  const isFormValid = Object.keys(errors).length === 0 &&
    formData.name && formData.email && formData.subject && formData.message;

  return (
    <section id="contact" className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* LEFT COLUMN - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Header */}
            <p className="text-sm font-mono text-secondary uppercase tracking-[0.3em] mb-4">
              09 / GET IN TOUCH
            </p>
            {settingsLoading ? (
              <>
                <div className="h-20 w-3/4 bg-muted animate-pulse rounded-lg mb-6" />
                <div className="h-8 w-full bg-muted animate-pulse rounded-lg" />
              </>
            ) : (
              <>
                <h2 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">
                  {settings?.contactHeading || "Let's build something remarkable"}
                </h2>
                <p className="text-lg text-foreground/70 max-w-md">
                  {settings?.contactSubtitle || "Whether you're a recruiter, collaborator, or just want to chat about markets — my inbox is open."}
                </p>
              </>
            )}

            {/* Contact methods */}
            <div className="flex flex-col gap-4 mt-12">
              {settingsLoading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 bg-muted animate-pulse rounded-2xl" />
                  ))}
                </>
              ) : (
                <>
                  {/* Email - always show with fallback */}
                  <a
                    href={`mailto:${settings?.contactEmail || 'contact@example.com'}`}
                    className="group flex items-center gap-4 p-4 rounded-2xl border border-foreground/10 hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-foreground/60 uppercase">Email</p>
                      <p className="text-foreground font-medium">{settings?.contactEmail || 'contact@example.com'}</p>
                    </div>
                  </a>

                  {/* Phone - only show if not empty */}
                  {settings?.contactPhone && settings.contactPhone.trim() !== '' && (
                    <a
                      href={`tel:${settings.contactPhone}`}
                      className="group flex items-center gap-4 p-4 rounded-2xl border border-foreground/10 hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all">
                        <Phone size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-mono text-foreground/60 uppercase">Phone</p>
                        <p className="text-foreground font-medium">{settings.contactPhone}</p>
                      </div>
                    </a>
                  )}

                  {/* Location - only show if not empty */}
                  {settings?.contactLocation && settings.contactLocation.trim() !== '' && (
                    <div className="group flex items-center gap-4 p-4 rounded-2xl border border-foreground/10 hover:border-primary hover:bg-primary/5 transition-all">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-mono text-foreground/60 uppercase">Location</p>
                        <p className="text-foreground font-medium">{settings.contactLocation}</p>
                      </div>
                    </div>
                  )}

                  {/* LinkedIn - only show if not empty */}
                  {settings?.linkedinUrl && settings.linkedinUrl.trim() !== '' && (
                    <a
                      href={settings.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-4 rounded-2xl border border-foreground/10 hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all">
                        <Share2 size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-mono text-foreground/60 uppercase">LinkedIn</p>
                        <p className="text-foreground font-medium">
                          {settings.linkedinUrl.replace('https://linkedin.com', '').replace('https://www.linkedin.com', '')}
                        </p>
                      </div>
                    </a>
                  )}
                </>
              )}
            </div>

            {/* Response time indicator */}
            {!settingsLoading && (
              <div className="mt-8 p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <p className="text-sm text-foreground/70">
                    {settings?.contactResponseTime || 'Usually responds within 24 hours'}
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* RIGHT COLUMN - Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="bg-background border border-foreground/10 rounded-3xl p-8 md:p-10 shadow-xl">
              <AnimatePresence mode="wait">
                {submitStatus === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-8"
                  >
                    <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
                    <h3 className="text-3xl font-serif font-bold mb-4">
                      Message sent! 🎉
                    </h3>
                    <p className="text-foreground/70 mb-8">
                      Thanks for reaching out. I'll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={resetForm}
                      className="px-6 py-3 border border-foreground/20 rounded-xl hover:border-primary hover:text-primary transition-all font-medium"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className="text-3xl font-serif font-bold mb-2">Send a message</h3>
                    <p className="text-foreground/60 mb-8">I'll get back to you ASAP</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="text-sm font-medium mb-2 block">
                          Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          placeholder="Your name"
                        />
                        {touched.name && errors.name && (
                          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="text-sm font-medium mb-2 block">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          placeholder="your.email@example.com"
                        />
                        {touched.email && errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                      </div>

                      {/* Subject */}
                      <div>
                        <label htmlFor="subject" className="text-sm font-medium mb-2 block">
                          Subject *
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          placeholder="What's this about?"
                        />
                        {touched.subject && errors.subject && (
                          <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                        )}
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="message" className="text-sm font-medium mb-2 block">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                          placeholder="Tell me more..."
                        />
                        {touched.message && errors.message && (
                          <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                        )}
                      </div>

                      {/* Error message */}
                      {submitStatus === 'error' && errorMessage && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                          {errorMessage}
                        </div>
                      )}

                      {/* Submit button */}
                      <button
                        type="submit"
                        disabled={isSubmitting || !isFormValid}
                        className="w-full px-6 py-4 bg-primary text-background font-medium rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={20} />
                            Send message
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

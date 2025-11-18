
import React, { useState, useEffect } from 'react';
import { UserCircleIcon, TargetIcon, CalendarIcon, PaperAirplaneIcon } from './Icons';
import { IntakeFormContent } from '../types';
import { supabase } from '../lib/supabaseClient';

interface IntakeFormProps {
  content: IntakeFormContent;
  id: string;
}

const IntakeForm: React.FC<IntakeFormProps> = ({ content: formContent, id }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    fitnessLevel: 'Select fitness level',
    goals: '',
    injuries: '',
    availability: [] as string[],
    service: 'Select preferred service',
    budget: 'Select budget range',
    additionalInfo: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleServiceSelection = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail) {
            setFormData(prev => ({ ...prev, service: customEvent.detail }));
        }
    };
    window.addEventListener('serviceSelected', handleServiceSelection);
    return () => window.removeEventListener('serviceSelected', handleServiceSelection);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, checked } = e.target;
      setFormData(prev => {
          const currentAvailability = [...prev.availability];
          if (checked) {
              currentAvailability.push(id);
          } else {
              const index = currentAvailability.indexOf(id);
              if (index > -1) {
                  currentAvailability.splice(index, 1);
              }
          }
          return { ...prev, availability: currentAvailability };
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Basic Validation
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.goals) {
          setErrorMessage('Please fill out all required fields marked with *');
          setStatus('error');
          return;
      }

      setStatus('loading');
      setErrorMessage('');

      try {
          const { error } = await supabase.from('intake_submissions').insert([{
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              age: formData.age,
              fitness_level: formData.fitnessLevel,
              goals: formData.goals,
              injuries: formData.injuries,
              availability: formData.availability,
              preferred_service: formData.service,
              budget: formData.budget,
              additional_info: formData.additionalInfo
          }]);

          if (error) throw error;

          setStatus('success');
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            age: '',
            fitnessLevel: 'Select fitness level',
            goals: '',
            injuries: '',
            availability: [],
            service: 'Select preferred service',
            budget: 'Select budget range',
            additionalInfo: ''
          });

      } catch (error: any) {
          console.error('Error submitting intake form:', error);
          setErrorMessage(error.message || 'There was an error submitting your form. Please try again.');
          setStatus('error');
      }
  };

  const Label: React.FC<{ htmlFor?: string, children: React.ReactNode, className?: string }> = ({ htmlFor, children, className }) => (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-[#1A1A1A] mb-1 ${className}`}>
        {children}
    </label>
  );

  const Input: React.FC<{ id: string, type: string, placeholder?: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ id, type, placeholder, value, onChange }) => (
    <input 
        type={type} 
        id={id} 
        value={value}
        onChange={onChange}
        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-[#1A1A1A] focus:ring-[#8C1E1E] focus:border-[#8C1E1E]" 
        placeholder={placeholder} 
    />
  );

  const Select: React.FC<{ id: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode }> = ({ id, value, onChange, children }) => (
    <select 
        id={id} 
        value={value} 
        onChange={onChange}
        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-[#1A1A1A] focus:ring-[#8C1E1E] focus:border-[#8C1E1E]"
    >
        {children}
    </select>
  );

  const FormSection: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="mt-8">
        <div className="flex items-center mb-4">
            <div className="text-[#8C1E1E] mr-3">{icon}</div>
            <h3 className="text-lg font-semibold text-[#1A1A1A]">{title}</h3>
        </div>
        {children}
    </div>
  );

  return (
    <section id={id} className="py-20 md:py-28 bg-[#E8E6DC]">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A]">{formContent.headline}</h2>
        <p className="mt-4 text-[#1A1A1A]/90 max-w-2xl mx-auto">
          {formContent.subheading}
        </p>
        <div className="mt-12 max-w-4xl mx-auto bg-white/50 p-8 rounded-2xl shadow-lg text-left">
          {status === 'success' ? (
             <div className="text-center py-12">
                <div className="bg-green-100 text-green-800 p-6 rounded-full inline-flex items-center justify-center mb-6">
                    <PaperAirplaneIcon className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">Intake Form Received!</h3>
                <p className="text-[#1A1A1A]/80 max-w-md mx-auto">
                    Thank you for sharing your information. I've received your details and will be reviewing them shortly. Expect an email from me at <strong>aarondeville@yahoo.com</strong> within 24 hours to discuss next steps.
                </p>
                <button onClick={() => setStatus('idle')} className="mt-8 text-[#8C1E1E] hover:text-[#7a1a1a] font-semibold underline">
                    Submit another form
                </button>
             </div>
          ) : (
            <form onSubmit={handleSubmit}>
                <FormSection icon={<UserCircleIcon className="h-6 w-6"/>} title="Personal Information">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input id="firstName" type="text" value={formData.firstName} onChange={handleInputChange} />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input id="lastName" type="text" value={formData.lastName} onChange={handleInputChange} />
                        </div>
                        <div>
                            <Label htmlFor="email">Email Address *</Label>
                            <Input id="email" type="email" value={formData.email} onChange={handleInputChange} />
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
                        </div>
                        <div>
                            <Label htmlFor="age">Age *</Label>
                            <Input id="age" type="number" value={formData.age} onChange={handleInputChange} />
                        </div>
                        <div>
                            <Label htmlFor="fitnessLevel">Current Fitness Level *</Label>
                            <Select id="fitnessLevel" value={formData.fitnessLevel} onChange={handleInputChange}>
                                <option>Select fitness level</option>
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </Select>
                        </div>
                    </div>
                </FormSection>

                <FormSection icon={<TargetIcon className="h-6 w-6"/>} title="Goals & Health Information">
                    <div>
                        <Label htmlFor="goals">Primary Fitness Goals *</Label>
                        <textarea id="goals" value={formData.goals} onChange={handleInputChange} rows={4} className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-[#1A1A1A] focus:ring-[#8C1E1E] focus:border-[#8C1E1E]" placeholder="e.g., lose weight, build muscle, improve endurance, get stronger..."></textarea>
                    </div>
                    <div className="mt-6">
                        <Label htmlFor="injuries">Injuries or Physical Limitations</Label>
                        <textarea id="injuries" value={formData.injuries} onChange={handleInputChange} rows={4} className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-[#1A1A1A] focus:ring-[#8C1E1E] focus:border-[#8C1E1E]" placeholder="Please describe any injuries, pain, or physical limitations I should know about..."></textarea>
                    </div>
                </FormSection>
                
                <FormSection icon={<CalendarIcon className="h-6 w-6"/>} title="Availability & Preferences">
                    <div>
                        <Label className="mb-2">When are you typically available? (Select all that apply)</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-[#1A1A1A]/90">
                            {['Early Morning (6-9 AM)', 'Morning (9-12 PM)', 'Afternoon (12-5 PM)', 'Evening (5-8 PM)', 'Weekends Only', 'Flexible Schedule'].map(time => (
                                <div key={time} className="flex items-center">
                                    <input 
                                        id={time} 
                                        type="checkbox" 
                                        checked={formData.availability.includes(time)}
                                        onChange={handleCheckboxChange}
                                        className="h-4 w-4 text-[#8C1E1E] border-gray-300 rounded focus:ring-[#8C1E1E]"
                                    />
                                    <label htmlFor={time} className="ml-2 text-sm">{time}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6 mt-6">
                        <div>
                            <Label htmlFor="service">Preferred Service *</Label>
                            <Select 
                                id="service" 
                                value={formData.service} 
                                onChange={handleInputChange}
                            >
                                <option>Select preferred service</option>
                                <option>Personal Training</option>
                                <option>Group Training</option>
                                <option>Virtual Training</option>
                                <option>Nutrition Coaching</option>
                                <option>Free Consultation</option>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="budget">Monthly Budget Range</Label>
                            <Select id="budget" value={formData.budget} onChange={handleInputChange}>
                                <option>Select budget range</option>
                                <option>$200 - $400</option>
                                <option>$400 - $600</option>
                                <option>$600+</option>
                            </Select>
                        </div>
                    </div>
                </FormSection>

                <div className="mt-8">
                    <Label htmlFor="additionalInfo">Additional Information</Label>
                    <textarea id="additionalInfo" value={formData.additionalInfo} onChange={handleInputChange} rows={4} className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-[#1A1A1A] focus:ring-[#8C1E1E] focus:border-[#8C1E1E]" placeholder="Anything else you'd like me to know? Questions about training? Special considerations?"></textarea>
                </div>
                
                <div className="mt-8 text-center">
                    {status === 'error' && <p className="text-red-600 mb-4 bg-red-100 p-3 rounded">{errorMessage}</p>}
                    <button 
                        type="submit" 
                        disabled={status === 'loading'}
                        className="bg-[#8C1E1E] text-[#E8E6DC] px-8 py-3 rounded-lg font-semibold hover:bg-[#7a1a1a] transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? 'Submitting...' : 'Submit Intake Form'} <PaperAirplaneIcon className="h-5 w-5"/>
                    </button>
                    <p className="text-xs text-[#1A1A1A]/70 mt-4">By submitting this form, you agree to receive communications about your fitness journey. Your information is kept confidential.</p>
                </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default IntakeForm;

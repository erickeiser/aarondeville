

import React from 'react';
import { UserCircleIcon, TargetIcon, CalendarIcon, PaperAirplaneIcon } from './Icons';
import { IntakeFormContent } from '../types';

interface IntakeFormProps {
  content: IntakeFormContent;
  id: string;
}

const IntakeForm: React.FC<IntakeFormProps> = ({ content: formContent, id }) => {
    
  const Label: React.FC<{ htmlFor?: string, children: React.ReactNode, className?: string }> = ({ htmlFor, children, className }) => (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-[#1A1A1A] mb-1 ${className}`}>
        {children}
    </label>
  );

  const Input: React.FC<{ id: string, type: string, placeholder?: string }> = ({ id, type, placeholder }) => (
    <input type={type} id={id} className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-[#1A1A1A] focus:ring-[#8C1E1E] focus:border-[#8C1E1E]" placeholder={placeholder} />
  );

  const Select: React.FC<{ id: string, children: React.ReactNode }> = ({ id, children }) => (
    <select id={id} className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-[#1A1A1A] focus:ring-[#8C1E1E] focus:border-[#8C1E1E]">
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
          <form onSubmit={(e) => e.preventDefault()}>
            <FormSection icon={<UserCircleIcon className="h-6 w-6"/>} title="Personal Information">
                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" type="text" />
                    </div>
                    <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" type="text" />
                    </div>
                     <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" />
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" type="tel" />
                    </div>
                    <div>
                        <Label htmlFor="age">Age *</Label>
                        <Input id="age" type="number" />
                    </div>
                    <div>
                        <Label htmlFor="fitnessLevel">Current Fitness Level *</Label>
                        <Select id="fitnessLevel">
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
                    <textarea id="goals" rows={4} className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-[#1A1A1A] focus:ring-[#8C1E1E] focus:border-[#8C1E1E]" placeholder="e.g., lose weight, build muscle, improve endurance, get stronger..."></textarea>
                </div>
                <div className="mt-6">
                    <Label htmlFor="injuries">Injuries or Physical Limitations</Label>
                    <textarea id="injuries" rows={4} className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-[#1A1A1A] focus:ring-[#8C1E1E] focus:border-[#8C1E1E]" placeholder="Please describe any injuries, pain, or physical limitations I should know about..."></textarea>
                </div>
            </FormSection>
            
            <FormSection icon={<CalendarIcon className="h-6 w-6"/>} title="Availability & Preferences">
                 <div>
                    <Label className="mb-2">When are you typically available? (Select all that apply)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-[#1A1A1A]/90">
                        {['Early Morning (6-9 AM)', 'Morning (9-12 PM)', 'Afternoon (12-5 PM)', 'Evening (5-8 PM)', 'Weekends Only', 'Flexible Schedule'].map(time => (
                            <div key={time} className="flex items-center">
                                <input id={time} type="checkbox" className="h-4 w-4 text-[#8C1E1E] border-gray-300 rounded focus:ring-[#8C1E1E]"/>
                                <label htmlFor={time} className="ml-2 text-sm">{time}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6 mt-6">
                    <div>
                        <Label htmlFor="service">Preferred Service *</Label>
                        <Select id="service">
                            <option>Select preferred service</option>
                            <option>Personal Training</option>
                            <option>Group Training</option>
                            <option>Virtual Training</option>
                            <option>Nutrition Coaching</option>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="budget">Monthly Budget Range</Label>
                        <Select id="budget">
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
                <textarea id="additionalInfo" rows={4} className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-[#1A1A1A] focus:ring-[#8C1E1E] focus:border-[#8C1E1E]" placeholder="Anything else you'd like me to know? Questions about training? Special considerations?"></textarea>
            </div>
            
            <div className="mt-8 text-center">
                <button type="submit" className="bg-[#8C1E1E] text-[#E8E6DC] px-8 py-3 rounded-lg font-semibold hover:bg-[#7a1a1a] transition-colors inline-flex items-center gap-2">
                    Submit Intake Form <PaperAirplaneIcon className="h-5 w-5"/>
                </button>
                <p className="text-xs text-[#1A1A1A]/70 mt-4">By submitting this form, you agree to receive communications about your fitness journey. Your information is kept confidential.</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default IntakeForm;

import React, { useState, useEffect } from 'react';
import { UserCircleIcon, TargetIcon, CalendarIcon, PaperAirplaneIcon } from './Icons';
import { IntakeFormContent, IntakeFormField } from '../types';
import { supabase } from '../lib/supabaseClient';

interface IntakeFormProps {
  content: IntakeFormContent;
  id: string;
}

// Map icon strings to components
const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    UserCircleIcon,
    TargetIcon,
    CalendarIcon,
    PaperAirplaneIcon,
};

const IntakeForm: React.FC<IntakeFormProps> = ({ content: formContent, id }) => {
  // Initialize state based on fields in content.sections
  const initialFormData: Record<string, any> = {};
  const sections = formContent.sections || [];

  sections.forEach(section => {
      section.fields.forEach(field => {
          if (field.type === 'checkbox-group') {
              initialFormData[field.id] = [];
          } else {
              initialFormData[field.id] = '';
          }
      });
  });

  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleServiceSelection = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail) {
            // Look for a field with id 'preferred_service' or similar
            const serviceFieldId = 'preferred_service';
            setFormData(prev => ({ ...prev, [serviceFieldId]: customEvent.detail }));
        }
    };
    window.addEventListener('serviceSelected', handleServiceSelection);
    return () => window.removeEventListener('serviceSelected', handleServiceSelection);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, fieldId: string) => {
      const { value, checked } = e.target;
      setFormData(prev => {
          const currentArray = [...(prev[fieldId] || [])];
          if (checked) {
              currentArray.push(value);
          } else {
              const index = currentArray.indexOf(value);
              if (index > -1) {
                  currentArray.splice(index, 1);
              }
          }
          return { ...prev, [fieldId]: currentArray };
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Basic Validation based on 'required' field in content
      const missingFields = [];
      for (const section of sections) {
          for (const field of section.fields) {
              if (field.required) {
                  const val = formData[field.id];
                  if (!val || (Array.isArray(val) && val.length === 0)) {
                      missingFields.push(field.label);
                  }
              }
          }
      }

      if (missingFields.length > 0) {
          setErrorMessage(`Please fill out the following required fields: ${missingFields.join(', ')}`);
          setStatus('error');
          return;
      }

      setStatus('loading');
      setErrorMessage('');

      try {
          // The formData keys match the DB columns because we configured them that way in defaultContent
          const { error } = await supabase.from('intake_submissions').insert([formData]);

          if (error) throw error;

          setStatus('success');
          setFormData(initialFormData); // Reset form

      } catch (error: any) {
          console.error('Error submitting intake form:', error);
          
          let msg = 'There was an error submitting your form. Please try again.';
          
          if (error) {
            // Handle specific Supabase/Postgres codes
            if (error.code === '42P01') {
                msg = 'System Configuration Error: The database table is missing. Administrator: Check Admin > Intake Forms for setup instructions.';
            } else if (error.code === '42703') {
                msg = 'System Configuration Error: Form fields do not match database columns. Please check the Admin Panel configuration.';
            } else if (error.message) {
                msg = error.message;
            } else if (error.error_description) {
                msg = error.error_description;
            } else if (typeof error === 'string') {
                msg = error;
            } else {
                // Fallback for objects that don't match above but might be stringifiable
                try {
                     const str = JSON.stringify(error);
                     if (str !== '{}' && str !== '[]') {
                        msg = `Error: ${str}`;
                     } else {
                        // If JSON.stringify is empty (common with native Error objects), try toString
                         msg = error.toString();
                     }
                } catch (e) {
                    msg = 'An unknown error occurred.';
                }
            }
          }

          setErrorMessage(msg);
          setStatus('error');
      }
  };

  const Label: React.FC<{ htmlFor?: string, children: React.ReactNode, className?: string, required?: boolean }> = ({ htmlFor, children, className, required }) => (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-[#1A1A1A] mb-1 ${className}`}>
        {children} {required && <span className="text-red-500">*</span>}
    </label>
  );

  const renderField = (field: IntakeFormField) => {
      const commonClasses = "w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-[#1A1A1A] focus:ring-[#8C1E1E] focus:border-[#8C1E1E]";
      
      switch(field.type) {
          case 'select':
              return (
                  <select id={field.id} value={formData[field.id] || ''} onChange={handleInputChange} className={commonClasses}>
                      {field.options?.map(opt => (
                          <option key={opt} value={opt === field.options?.[0] ? '' : opt}>{opt}</option>
                      ))}
                  </select>
              );
          case 'textarea':
              return (
                  <textarea id={field.id} value={formData[field.id] || ''} onChange={handleInputChange} rows={4} className={commonClasses} placeholder={field.placeholder} />
              );
          case 'checkbox-group':
              return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-[#1A1A1A]/90">
                      {field.options?.map(opt => (
                          <div key={opt} className="flex items-start">
                              <input 
                                  id={`${field.id}-${opt}`} 
                                  type="checkbox" 
                                  value={opt}
                                  checked={(formData[field.id] || []).includes(opt)}
                                  onChange={(e) => handleCheckboxChange(e, field.id)}
                                  className="mt-1 h-4 w-4 text-[#8C1E1E] border-gray-300 rounded focus:ring-[#8C1E1E]"
                              />
                              <label htmlFor={`${field.id}-${opt}`} className="ml-2 text-sm leading-snug">{opt}</label>
                          </div>
                      ))}
                  </div>
              );
          default:
              return (
                  <input 
                    type={field.type} 
                    id={field.id} 
                    value={formData[field.id] || ''} 
                    onChange={handleInputChange} 
                    className={commonClasses} 
                    placeholder={field.placeholder} 
                  />
              );
      }
  };

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
                    Thank you for sharing your information. I've received your details and will be reviewing them shortly.
                </p>
                <button onClick={() => setStatus('idle')} className="mt-8 text-[#8C1E1E] hover:text-[#7a1a1a] font-semibold underline">
                    Submit another form
                </button>
             </div>
          ) : (
            <form onSubmit={handleSubmit}>
                {sections.map((section) => {
                    const IconComponent = iconMap[section.icon] || UserCircleIcon;
                    return (
                        <div key={section.id} className="mt-8 first:mt-0">
                            <div className="flex items-center mb-4 border-b border-gray-300 pb-2">
                                <div className="text-[#8C1E1E] mr-3">
                                    <IconComponent className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-semibold text-[#1A1A1A]">{section.title}</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {section.fields.map(field => (
                                    <div key={field.id} className={`${field.width === 'full' ? 'md:col-span-2' : ''}`}>
                                        <Label htmlFor={field.id} required={field.required}>{field.label}</Label>
                                        {renderField(field)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
                
                <div className="mt-10 text-center">
                    {status === 'error' && <p className="text-red-600 mb-4 bg-red-100 p-3 rounded text-sm font-semibold">{errorMessage}</p>}
                    <button 
                        type="submit" 
                        disabled={status === 'loading'}
                        className="bg-[#8C1E1E] text-[#E8E6DC] px-8 py-3 rounded-lg font-semibold hover:bg-[#7a1a1a] transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? 'Submitting...' : (formContent.submitButtonText || 'Submit Intake Form')} <PaperAirplaneIcon className="h-5 w-5"/>
                    </button>
                    {formContent.disclaimer && (
                        <p className="text-xs text-[#1A1A1A]/70 mt-4">{formContent.disclaimer}</p>
                    )}
                </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default IntakeForm;

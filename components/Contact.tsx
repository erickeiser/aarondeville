
import React, { useState } from 'react';
import { MailIcon, PhoneIcon, LocationMarkerIcon, ClockIcon, PaperAirplaneIcon } from './Icons';
import { ContactContent } from '../types';
import { supabase } from '../lib/supabaseClient';

interface ContactProps {
  content: ContactContent;
  id: string;
}

const Contact: React.FC<ContactProps> = ({ content: contactContent, id }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const key = id.replace('contact', '').toLowerCase();
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        setErrorMessage('Please fill out all required fields.');
        setStatus('error');
        return;
    }

    setStatus('loading');
    setErrorMessage('');

    const { error } = await supabase.from('contact_submissions').insert([
        { name: formData.name, email: formData.email, subject: formData.subject, message: formData.message }
    ]);

    if (error) {
        console.error('Error submitting form:', error);
        setErrorMessage('There was an error sending your message. Please try again.');
        setStatus('error');
    } else {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    }
  };
    
  const Label: React.FC<{ htmlFor: string, children: React.ReactNode }> = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300 mb-1">{children}</label>
  );
    
  return (
    <section id={id} className="py-20 md:py-28 bg-[#1f1f1f]">
      <div className="container mx-auto px-6">
        <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">{contactContent.headline}</h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                {contactContent.subheading.line1}
                <br />
                {contactContent.subheading.line2}
            </p>
        </div>
        <div className="mt-16 grid lg:grid-cols-2 gap-16 items-start">
            <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3"><span className="text-red-600">|</span> {contactContent.connect.title}</h3>
                <p className="text-gray-300 mb-8">
                    {contactContent.connect.paragraph}
                </p>
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-gray-800 p-3 rounded-full"><MailIcon className="h-6 w-6 text-red-500"/></div>
                        <div>
                            <h4 className="font-semibold">Email</h4>
                            <p className="text-gray-400">{contactContent.details.email.address}</p>
                            <p className="text-sm text-gray-500">{contactContent.details.email.note}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-gray-800 p-3 rounded-full"><PhoneIcon className="h-6 w-6 text-red-500"/></div>
                        <div>
                            <h4 className="font-semibold">Phone</h4>
                            <p className="text-gray-400">{contactContent.details.phone.number}</p>
                            <p className="text-sm text-gray-500">{contactContent.details.phone.note}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-gray-800 p-3 rounded-full"><LocationMarkerIcon className="h-6 w-6 text-red-500"/></div>
                        <div>
                            <h4 className="font-semibold">Location</h4>
                            <p className="text-gray-400">{contactContent.details.location.name}</p>
                            <p className="text-gray-400">{contactContent.details.location.address}</p>
                            <p className="text-sm text-gray-500">{contactContent.details.location.note}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="bg-gray-800 p-3 rounded-full"><ClockIcon className="h-6 w-6 text-red-500"/></div>
                        <div>
                            <h4 className="font-semibold">Availability</h4>
                            {contactContent.details.availability.map((line, index) => (
                              <p key={index} className="text-gray-400">{line}</p>
                            ))}
                        </div>
                    </div>
                </div>
                 <div className="mt-8 bg-red-900/20 border border-red-800/50 p-6 rounded-lg">
                    <h4 className="font-semibold text-red-400">{contactContent.guarantee.title}</h4>
                    <p className="text-gray-400 mt-2 text-sm">{contactContent.guarantee.text}</p>
                </div>
            </div>
            <div className="bg-[#2a2a2a] p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-6">{contactContent.form.title}</h3>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="contactName">{contactContent.form.nameLabel}</Label>
                        <input type="text" id="contactName" value={formData.name} onChange={handleInputChange} className="w-full bg-[#2a2a2a] border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div>
                        <Label htmlFor="contactEmail">{contactContent.form.emailLabel}</Label>
                        <input type="email" id="contactEmail" value={formData.email} onChange={handleInputChange} className="w-full bg-[#2a2a2a] border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div>
                        <Label htmlFor="contactSubject">{contactContent.form.subjectLabel}</Label>
                        <input type="text" id="contactSubject" value={formData.subject} onChange={handleInputChange} className="w-full bg-[#2a2a2a] border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-red-500 focus:border-red-500" placeholder={contactContent.form.subjectPlaceholder}/>
                    </div>
                    <div>
                        <Label htmlFor="contactMessage">{contactContent.form.messageLabel}</Label>
                        <textarea id="contactMessage" value={formData.message} onChange={handleInputChange} rows={5} className="w-full bg-[#2a2a2a] border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-red-500 focus:border-red-500" placeholder={contactContent.form.messagePlaceholder}></textarea>
                    </div>
                     <div className="h-10">
                        {status === 'success' && <p className="text-green-400 text-center">Message sent successfully! We'll be in touch soon.</p>}
                        {status === 'error' && <p className="text-red-400 text-center">{errorMessage}</p>}
                    </div>
                    <div>
                         <button type="submit" disabled={status === 'loading'} className="w-full bg-red-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors inline-flex items-center justify-center gap-2 disabled:bg-red-900 disabled:cursor-not-allowed">
                            {status === 'loading' ? 'Sending...' : contactContent.form.buttonText} <PaperAirplaneIcon className="h-5 w-5"/>
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

import React, { useState, FormEvent, useEffect } from 'react';
import { useContent } from '../../../hooks/useContent';
import { Input, Textarea } from './FormElements';
import { defaultContent } from '../../../contexts/ContentContext';

const FooterForm: React.FC = () => {
    const { content, setContent } = useContent();
    const [formData, setFormData] = useState(content.footer);
    const [status, setStatus] = useState('');

    useEffect(() => {
        setFormData(content.footer);
    }, [content.footer]);

    const handleInputChange = (section: keyof typeof formData, key: any, value: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                // @ts-ignore
                ...prev[section],
                [key]: value
            }
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setContent({ ...content, footer: formData });
        setStatus('Footer section saved successfully!');
        setTimeout(() => setStatus(''), 3000);
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset the Footer section to its default content? This will update the database.")) {
            setContent({ ...content, footer: defaultContent.footer });
            setStatus('Footer section has been reset to default.');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Footer Section</h2>
                
                <div className="space-y-4 p-4 border-l-4 border-red-500">
                    <Textarea label="Footer Tagline" id="tagline" value={formData.tagline} onChange={e => setFormData(p => ({...p, tagline: e.target.value}))} />
                    <Input label="Copyright Text" id="copyright" value={formData.copyright} onChange={e => setFormData(p => ({...p, copyright: e.target.value}))} />
                </div>
                
                <div className="space-y-4 p-4 mt-6 border-l-4 border-red-500">
                    <h3 className="text-lg font-semibold text-gray-700">Quick Links Column</h3>
                    <Input label="Column Title" id="qlTitle" value={formData.quickLinks.title} onChange={e => handleInputChange('quickLinks', 'title', e.target.value)} />
                    <Input label="'Get Started' Link Text" id="qlGetStarted" value={formData.quickLinks.getStarted} onChange={e => handleInputChange('quickLinks', 'getStarted', e.target.value)} />
                    <Input label="'Admin Panel' Link Text" id="qlAdmin" value={formData.quickLinks.admin} onChange={e => handleInputChange('quickLinks', 'admin', e.target.value)} />
                </div>
                
                <div className="space-y-4 p-4 mt-6 border-l-4 border-red-500">
                    <h3 className="text-lg font-semibold text-gray-700">Services Column</h3>
                    <Input label="Column Title" id="svcsTitle" value={formData.services.title} onChange={e => handleInputChange('services', 'title', e.target.value)} />
                    <Textarea label="Services List (one per line)" id="svcsList" value={formData.services.list.join('\n')} onChange={e => handleInputChange('services', 'list', e.target.value.split('\n'))} />
                </div>

                <div className="space-y-4 p-4 mt-6 border-l-4 border-red-500">
                    <h3 className="text-lg font-semibold text-gray-700">Contact Info Column</h3>
                    <Input label="Column Title" id="contactTitle" value={formData.contact.title} onChange={e => handleInputChange('contact', 'title', e.target.value)} />
                    <Input label="'Hours' Title" id="contactHours" value={formData.contact.hoursTitle} onChange={e => handleInputChange('contact', 'hoursTitle', e.target.value)} />
                </div>
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <button type="submit" className="bg-red-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-800 transition-colors">Save Changes</button>
                <button 
                    type="button" 
                    onClick={handleReset} 
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                    Reset Section
                </button>
                {status && <p className="text-green-600 font-semibold">{status}</p>}
            </div>
        </form>
    );
};

export default FooterForm;
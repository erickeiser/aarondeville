import React, { useState, FormEvent, useEffect } from 'react';
import { useContent } from '../../../hooks/useContent';
import { Input, Textarea } from './FormElements';
import { defaultContent } from '../../../contexts/ContentContext';

const ContactForm: React.FC = () => {
    const { content, setContent } = useContent();
    const [formData, setFormData] = useState(content.contact);
    const [status, setStatus] = useState('');

    useEffect(() => {
        setFormData(content.contact);
    }, [content.contact]);

    const handleInputChange = (section: keyof typeof formData, key: any, value: any, subKey?: any) => {
        setFormData(prev => {
            const sectionData = prev[section];
            // Fix: Guard against spreading non-object types. The `contact` object has a `headline`
            // property which is a string. Spreading a string causes a type error. This check ensures
            // that we only spread if the value is an object.
            if (typeof sectionData !== 'object' || sectionData === null) {
                // This function is only intended for updating nested objects.
                // Other updaters are used for primitive properties like `headline`.
                return prev;
            }

            const newSection = { ...sectionData };
            if(subKey) {
                // @ts-ignore
                newSection[key] = { ...newSection[key], [subKey]: value };
            } else {
                // @ts-ignore
                newSection[key] = value;
            }
            return { ...prev, [section]: newSection };
        });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setContent({ ...content, contact: formData });
        setStatus('Contact section saved successfully!');
        setTimeout(() => setStatus(''), 3000);
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset the Contact section to its default content? This will update the database.")) {
            setContent({ ...content, contact: defaultContent.contact });
            setStatus('Contact section has been reset to default.');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Contact Section</h2>
                
                <div className="space-y-4 p-4 border-l-4 border-red-500">
                    <h3 className="text-lg font-semibold text-gray-700">Main Titles</h3>
                    <Input label="Headline" id="headline" value={formData.headline} onChange={e => setFormData(p => ({...p, headline: e.target.value}))} />
                    <Input label="Subheading Line 1" id="sub1" value={formData.subheading.line1} onChange={e => handleInputChange('subheading', 'line1', e.target.value)} />
                    <Input label="Subheading Line 2" id="sub2" value={formData.subheading.line2} onChange={e => handleInputChange('subheading', 'line2', e.target.value)} />
                </div>

                <div className="space-y-4 p-4 mt-6 border-l-4 border-red-500">
                    <h3 className="text-lg font-semibold text-gray-700">"Let's Connect" Info</h3>
                    <Input label="Title" id="connectTitle" value={formData.connect.title} onChange={e => handleInputChange('connect', 'title', e.target.value)} />
                    <Textarea label="Paragraph" id="connectPara" value={formData.connect.paragraph} onChange={e => handleInputChange('connect', 'paragraph', e.target.value)} />
                </div>
                
                <div className="space-y-4 p-4 mt-6 border-l-4 border-red-500">
                    <h3 className="text-lg font-semibold text-gray-700">Contact Details</h3>
                    <Input label="Email Address" id="email" value={formData.details.email.address} onChange={e => handleInputChange('details', 'email', e.target.value, 'address')} />
                    <Input label="Email Note" id="emailNote" value={formData.details.email.note} onChange={e => handleInputChange('details', 'email', e.target.value, 'note')} />
                    <Input label="Phone Number" id="phone" value={formData.details.phone.number} onChange={e => handleInputChange('details', 'phone', e.target.value, 'number')} />
                    <Input label="Phone Note" id="phoneNote" value={formData.details.phone.note} onChange={e => handleInputChange('details', 'phone', e.target.value, 'note')} />
                    <Input label="Location Name" id="locName" value={formData.details.location.name} onChange={e => handleInputChange('details', 'location', e.target.value, 'name')} />
                    <Input label="Location Address" id="locAddr" value={formData.details.location.address} onChange={e => handleInputChange('details', 'location', e.target.value, 'address')} />
                    <Input label="Location Note" id="locNote" value={formData.details.location.note} onChange={e => handleInputChange('details', 'location', e.target.value, 'note')} />
                    <Textarea label="Availability (one per line)" id="availability" value={formData.details.availability.join('\n')} onChange={e => handleInputChange('details', 'availability', e.target.value.split('\n'))} />
                </div>
                
                <div className="space-y-4 p-4 mt-6 border-l-4 border-red-500">
                    <h3 className="text-lg font-semibold text-gray-700">Quick Guarantee Box</h3>
                    <Input label="Title" id="guaranteeTitle" value={formData.guarantee.title} onChange={e => handleInputChange('guarantee', 'title', e.target.value)} />
                    <Textarea label="Text" id="guaranteeText" value={formData.guarantee.text} onChange={e => handleInputChange('guarantee', 'text', e.target.value)} />
                </div>

                 <div className="space-y-4 p-4 mt-6 border-l-4 border-red-500">
                    <h3 className="text-lg font-semibold text-gray-700">Contact Form Labels</h3>
                    <Input label="Form Title" id="formTitle" value={formData.form.title} onChange={e => handleInputChange('form', 'title', e.target.value)} />
                    <Input label="Name Label" id="formName" value={formData.form.nameLabel} onChange={e => handleInputChange('form', 'nameLabel', e.target.value)} />
                    <Input label="Email Label" id="formEmail" value={formData.form.emailLabel} onChange={e => handleInputChange('form', 'emailLabel', e.target.value)} />
                    <Input label="Subject Label" id="formSubject" value={formData.form.subjectLabel} onChange={e => handleInputChange('form', 'subjectLabel', e.target.value)} />
                    <Input label="Subject Placeholder" id="formSubjectPlaceholder" value={formData.form.subjectPlaceholder} onChange={e => handleInputChange('form', 'subjectPlaceholder', e.target.value)} />
                    <Input label="Message Label" id="formMessage" value={formData.form.messageLabel} onChange={e => handleInputChange('form', 'messageLabel', e.target.value)} />
                    <Input label="Message Placeholder" id="formMessagePlaceholder" value={formData.form.messagePlaceholder} onChange={e => handleInputChange('form', 'messagePlaceholder', e.target.value)} />
                    <Input label="Button Text" id="formButton" value={formData.form.buttonText} onChange={e => handleInputChange('form', 'buttonText', e.target.value)} />
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

export default ContactForm;
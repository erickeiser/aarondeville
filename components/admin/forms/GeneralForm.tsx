
import React, { useState, FormEvent, useEffect } from 'react';
import { useContent } from '../../../hooks/useContent';
import { HeaderContent } from '../../../types';
import { Input, FormCard } from './FormElements';
import { defaultContent } from '../../../contexts/ContentContext';

const GeneralForm: React.FC = () => {
    const { content, setContent } = useContent();
    const [headerData, setHeaderData] = useState<HeaderContent>(content.header);
    const [status, setStatus] = useState('');

    useEffect(() => {
        setHeaderData(content.header);
    }, [content.header]);
    
    const handleInputChange = (key: keyof HeaderContent, value: any) => {
        setHeaderData(prev => ({ ...prev, [key]: value }));
    };
    
    const handleNavLinksChange = (index: number, key: 'text' | 'href', value: string) => {
        const newNavLinks = [...headerData.navLinks];
        newNavLinks[index] = { ...newNavLinks[index], [key]: value };
        handleInputChange('navLinks', newNavLinks);
    };

    const addNavLink = () => {
        const newNavLinks = [...headerData.navLinks, { text: 'New Link', href: '#' }];
        handleInputChange('navLinks', newNavLinks);
    };

    const removeNavLink = (index: number) => {
        if (window.confirm('Are you sure you want to remove this navigation link?')) {
            const newNavLinks = headerData.navLinks.filter((_, i) => i !== index);
            handleInputChange('navLinks', newNavLinks);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setContent({ ...content, header: headerData });
        setStatus('Settings saved successfully!');
        setTimeout(() => setStatus(''), 3000);
    };
    
    const handleReset = () => {
        if (window.confirm(`Are you sure you want to reset the Header Settings to default? This will update the database.`)) {
            setContent({ ...content, header: defaultContent.header });
            setStatus(`Header settings have been reset.`);
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Site Settings</h2>
            
            <FormCard title="Header Settings" onReset={handleReset}>
                <Input label="Site Name" id="siteName" value={headerData.siteName} onChange={e => handleInputChange('siteName', e.target.value)} />
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Navigation Links</label>
                    <div className="space-y-3">
                        {headerData.navLinks.map((link, index) => (
                            <div key={index} className="p-3 bg-gray-50 border rounded-md grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                                <Input 
                                    label={`Link ${index + 1} Text`} 
                                    id={`nav-text-${index}`} 
                                    value={link.text} 
                                    onChange={e => handleNavLinksChange(index, 'text', e.target.value)} 
                                />
                                <div className="flex items-center gap-2">
                                  <div className="flex-grow">
                                     <label htmlFor={`nav-href-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Link Destination</label>
                                     <select
                                        id={`nav-href-${index}`}
                                        value={link.href}
                                        onChange={e => handleNavLinksChange(index, 'href', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                                     >
                                        <option value="#">-- Select a Section --</option>
                                        {content.sections.map(s => (
                                            <option key={s.id} value={`#${s.id}`}>{s.type.charAt(0).toUpperCase() + s.type.slice(1)} ({s.id})</option>
                                        ))}
                                     </select>
                                   </div>
                                    <button type="button" onClick={() => removeNavLink(index)} className="text-red-600 hover:text-red-800 text-sm font-semibold pb-1 h-fit">Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addNavLink} className="mt-4 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 text-sm font-semibold">+ Add Nav Link</button>
                </div>
            </FormCard>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                    <button type="submit" className="bg-red-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-800 transition-colors w-full sm:w-auto mb-2 sm:mb-0">Save Changes</button>
                    {status && <p className="text-green-600 font-semibold text-sm">{status}</p>}
                </div>
            </div>
        </form>
    );
};

export default GeneralForm;
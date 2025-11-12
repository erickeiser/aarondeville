
import React, { useState, FormEvent, useEffect } from 'react';
import { useContent } from '../../../hooks/useContent';
import { Input, Textarea, FormCard } from './FormElements';
import { defaultContent } from '../../../contexts/ContentContext';

type Plan = {
    popular: boolean;
    title: string;
    price: string;
    description: string;
    features: string[];
}

const ServicesForm: React.FC = () => {
    const { content, setContent } = useContent();
    const [formData, setFormData] = useState(content.services);
    const [status, setStatus] = useState('');

    useEffect(() => {
        setFormData(content.services);
    }, [content.services]);

    const handleInputChange = (key: 'headline' | 'subheading', value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };
    
    const handlePlanChange = (index: number, key: keyof Plan, value: string | boolean | string[]) => {
        const newPlans = [...formData.plans];
        // @ts-ignore
        newPlans[index][key] = value;
        setFormData(prev => ({...prev, plans: newPlans}));
    };

    const addPlan = () => {
        const newPlan = { popular: false, title: 'New Plan', price: '$0', description: '', features: [] };
        setFormData(prev => ({...prev, plans: [...prev.plans, newPlan]}));
    };

    const removePlan = (index: number) => {
        if (window.confirm('Are you sure you want to delete this service plan?')) {
            const newPlans = formData.plans.filter((_, i) => i !== index);
            setFormData(prev => ({...prev, plans: newPlans}));
        }
    };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setContent({ ...content, services: formData });
        setStatus('Services section saved successfully!');
        setTimeout(() => setStatus(''), 3000);
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset the Services section to its default content? This will update the database.")) {
            setContent({ ...content, services: defaultContent.services });
            setStatus('Services section has been reset to default.');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Services Section</h2>

            <FormCard title="Main Content" onReset={handleReset}>
                <Input label="Headline" id="headline" value={formData.headline} onChange={e => handleInputChange('headline', e.target.value)} />
                <Textarea label="Subheading" id="subheading" value={formData.subheading} onChange={e => handleInputChange('subheading', e.target.value)} />
            </FormCard>
            
            <FormCard title="Service Plans">
                <div className="space-y-6">
                    {formData.plans.map((plan, index) => (
                        <div key={index} className="p-4 bg-gray-50 border rounded-lg space-y-4 relative">
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-lg text-gray-700">Plan {index + 1}</h4>
                                <button type="button" onClick={() => removePlan(index)} className="text-red-500 hover:text-red-700 text-sm font-bold">Remove</button>
                            </div>
                             
                            <div className="flex items-center">
                                <input type="checkbox" id={`popular-${index}`} checked={plan.popular} onChange={e => handlePlanChange(index, 'popular', e.target.checked)} className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"/>
                                <label htmlFor={`popular-${index}`} className="ml-2 block text-sm text-gray-900">Most Popular?</label>
                            </div>
                            
                            <Input label="Title" id={`title-${index}`} value={plan.title} onChange={e => handlePlanChange(index, 'title', e.target.value)} />
                            <Input label="Price" id={`price-${index}`} value={plan.price} onChange={e => handlePlanChange(index, 'price', e.target.value)} />
                            <Textarea label="Description" id={`desc-${index}`} value={plan.description} onChange={e => handlePlanChange(index, 'description', e.target.value)} />
                            <Textarea label="Features (one per line)" id={`features-${index}`} value={plan.features.join('\n')} onChange={e => handlePlanChange(index, 'features', e.target.value.split('\n'))} rows={5} />
                        </div>
                    ))}
                </div>
                 <button type="button" onClick={addPlan} className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-semibold">+ Add New Plan</button>
            </FormCard>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-6">
                <div className="flex items-center justify-between">
                    <button type="submit" className="bg-red-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-800 transition-colors">Save Changes</button>
                    {status && <p className="text-green-600 font-semibold text-sm">{status}</p>}
                </div>
            </div>
        </form>
    );
};

export default ServicesForm;

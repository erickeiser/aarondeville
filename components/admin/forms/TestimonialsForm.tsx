

import React, { useState, FormEvent, useEffect } from 'react';
import { useContent } from '../../../hooks/useContent';
import { Input, Textarea, ImageInput, FormCard } from './FormElements';
import { defaultContent } from '../../../contexts/ContentContext';
import { TestimonialsContent } from '../../../types';

type Story = TestimonialsContent['stories'][0];

interface TestimonialsFormProps {
    openMediaLibrary: (onSelect: (url: string) => void) => void;
    sectionId: string;
}

const TestimonialsForm: React.FC<TestimonialsFormProps> = ({ openMediaLibrary, sectionId }) => {
    const { content, updateSectionContent } = useContent();
    const sectionData = content.sections.find(s => s.id === sectionId)?.content as TestimonialsContent;

    const [formData, setFormData] = useState<TestimonialsContent | undefined>(sectionData);
    const [status, setStatus] = useState('');

    useEffect(() => {
        setFormData(content.sections.find(s => s.id === sectionId)?.content as TestimonialsContent);
    }, [content, sectionId]);
    
    if (!formData) return <div>Loading...</div>;

    const handleInputChange = (key: 'headline' | 'subheading', value: string) => {
        setFormData(prev => prev ? ({ ...prev, [key]: value }) : undefined);
    };
    
    const handleStoryChange = (index: number, key: keyof Story, value: string) => {
        const newStories = [...formData.stories];
        newStories[index] = { ...newStories[index], [key]: value };
        setFormData(prev => prev ? ({...prev, stories: newStories}) : undefined);
    };

    const addStory = () => {
        const newStory = { name: 'New Client', achievement: '', quote: '', imageUrl: '', avatarUrl: '', tag: '' };
        setFormData(prev => prev ? ({...prev, stories: [...prev.stories, newStory]}) : undefined);
    };

    const removeStory = (index: number) => {
        if (window.confirm('Are you sure you want to delete this testimonial?')) {
            const newStories = formData.stories.filter((_, i) => i !== index);
            setFormData(prev => prev ? ({...prev, stories: newStories}) : undefined);
        }
    };

    const handleGenerateStoryImage = (index: number) => {
        const timestamp = new Date().getTime();
        const newUrl = `https://source.unsplash.com/random/800x600?fitness,person,workout&t=${timestamp}`;
        handleStoryChange(index, 'imageUrl', newUrl);
    };

    const handleGenerateAvatarImage = (index: number) => {
        const timestamp = new Date().getTime();
        const newUrl = `https://source.unsplash.com/random/200x200?portrait,person,face&t=${timestamp}`;
        handleStoryChange(index, 'avatarUrl', newUrl);
    };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (formData) {
            updateSectionContent(sectionId, formData);
            setStatus('Testimonials section saved successfully!');
            setTimeout(() => setStatus(''), 3000);
        }
    };
    
    const handleReset = () => {
       if (window.confirm("Are you sure you want to reset this section to its default content?")) {
            const defaultSectionContent = defaultContent.sections.find(s => s.type === 'testimonials')?.content;
            if (defaultSectionContent) {
                updateSectionContent(sectionId, defaultSectionContent);
                setStatus('Testimonials section has been reset.');
                setTimeout(() => setStatus(''), 3000);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Testimonials Section</h2>

            <FormCard title="Main Content" onReset={handleReset}>
                <Input label="Headline" id="headline" value={formData.headline} onChange={e => handleInputChange('headline', e.target.value)} />
                <Textarea label="Subheading" id="subheading" value={formData.subheading} onChange={e => handleInputChange('subheading', e.target.value)} />
            </FormCard>
            
            <FormCard title="Client Stories">
                <div className="space-y-6">
                    {formData.stories.map((story, index) => (
                        <div key={index} className="p-4 bg-gray-50 border rounded-lg space-y-4 relative">
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-lg text-gray-700">Testimonial {index + 1}</h4>
                                <button type="button" onClick={() => removeStory(index)} className="text-red-500 hover:text-red-700 text-sm font-bold">Remove</button>
                            </div>
                            
                            <Input label="Name" id={`name-${index}`} value={story.name} onChange={e => handleStoryChange(index, 'name', e.target.value)} />
                            <Input label="Achievement" id={`achievement-${index}`} value={story.achievement} onChange={e => handleStoryChange(index, 'achievement', e.target.value)} />
                            <Textarea label="Quote" id={`quote-${index}`} value={story.quote} onChange={e => handleStoryChange(index, 'quote', e.target.value)} />
                            <Input label="Tag (e.g. -30 lbs)" id={`tag-${index}`} value={story.tag} onChange={e => handleStoryChange(index, 'tag', e.target.value)} />
                            <ImageInput 
                                label="Image URL" 
                                id={`imageUrl-${index}`} 
                                value={story.imageUrl} 
                                onChange={e => handleStoryChange(index, 'imageUrl', e.target.value)}
                                onGenerate={() => handleGenerateStoryImage(index)}
                                onSelect={() => openMediaLibrary(url => handleStoryChange(index, 'imageUrl', url))}
                            />
                            <ImageInput 
                                label="Avatar URL" 
                                id={`avatarUrl-${index}`} 
                                value={story.avatarUrl} 
                                onChange={e => handleStoryChange(index, 'avatarUrl', e.target.value)}
                                onGenerate={() => handleGenerateAvatarImage(index)}
                                onSelect={() => openMediaLibrary(url => handleStoryChange(index, 'avatarUrl', url))}
                            />
                        </div>
                    ))}
                </div>
                 <button type="button" onClick={addStory} className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-semibold">+ Add New Testimonial</button>
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

export default TestimonialsForm;

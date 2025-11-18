
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { TrashIcon, EyeIcon } from '../Icons';

interface IntakeSubmission {
    id: number;
    created_at: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    age: string;
    fitness_level: string;
    goals: string;
    injuries: string;
    availability: string[];
    preferred_service: string;
    budget: string;
    additional_info: string;
}

const IntakeSubmissions: React.FC = () => {
    const [submissions, setSubmissions] = useState<IntakeSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSubmission, setSelectedSubmission] = useState<IntakeSubmission | null>(null);

    const fetchSubmissions = useCallback(async () => {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
            .from('intake_submissions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching intake submissions:', error);
            setError('Failed to load submissions. Please check the browser console for details.');
        } else {
            setSubmissions(data || []);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
            const { error } = await supabase
                .from('intake_submissions')
                .delete()
                .eq('id', id);
            
            if (error) {
                console.error('Error deleting submission:', error);
                setError(`Failed to delete submission: ${error.message}`);
            } else {
                fetchSubmissions(); // Refresh the list
                if (selectedSubmission?.id === id) setSelectedSubmission(null);
            }
        }
    };
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Intake Form Submissions</h2>

            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-200px)] overflow-y-auto">
                     {loading ? <p>Loading...</p> : (
                        submissions.length === 0 ? <p className="text-gray-500 text-center py-4">No submissions yet.</p> : (
                            <ul className="space-y-2">
                                {submissions.map(sub => (
                                    <li 
                                        key={sub.id} 
                                        onClick={() => setSelectedSubmission(sub)}
                                        className={`p-3 rounded-md cursor-pointer border transition-colors ${selectedSubmission?.id === sub.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50 border-transparent'}`}
                                    >
                                        <p className="font-bold text-gray-800">{sub.first_name} {sub.last_name}</p>
                                        <p className="text-xs text-gray-500">{sub.preferred_service}</p>
                                        <p className="text-xs text-gray-400 mt-1">{new Date(sub.created_at).toLocaleDateString()}</p>
                                    </li>
                                ))}
                            </ul>
                        )
                    )}
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-200px)] overflow-y-auto">
                    {selectedSubmission ? (
                        <div>
                            <div className="flex justify-between items-start mb-6 border-b pb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{selectedSubmission.first_name} {selectedSubmission.last_name}</h3>
                                    <p className="text-gray-600">{selectedSubmission.email} • {selectedSubmission.phone}</p>
                                    <p className="text-sm text-gray-400 mt-1">Submitted: {new Date(selectedSubmission.created_at).toLocaleString()}</p>
                                </div>
                                <button 
                                    onClick={() => handleDelete(selectedSubmission.id)}
                                    className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition-colors flex items-center"
                                >
                                    <TrashIcon className="h-5 w-5 mr-1" /> Delete
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <p className="text-xs font-bold text-gray-500 uppercase">Age</p>
                                        <p className="text-gray-800">{selectedSubmission.age}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <p className="text-xs font-bold text-gray-500 uppercase">Fitness Level</p>
                                        <p className="text-gray-800">{selectedSubmission.fitness_level}</p>
                                    </div>
                                     <div className="p-3 bg-gray-50 rounded-md">
                                        <p className="text-xs font-bold text-gray-500 uppercase">Preferred Service</p>
                                        <p className="text-gray-800">{selectedSubmission.preferred_service}</p>
                                    </div>
                                     <div className="p-3 bg-gray-50 rounded-md">
                                        <p className="text-xs font-bold text-gray-500 uppercase">Budget</p>
                                        <p className="text-gray-800">{selectedSubmission.budget}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-gray-700 mb-2">Goals</p>
                                    <p className="p-3 bg-gray-50 rounded-md text-gray-800 whitespace-pre-wrap">{selectedSubmission.goals}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-gray-700 mb-2">Injuries / Limitations</p>
                                    <p className="p-3 bg-gray-50 rounded-md text-gray-800 whitespace-pre-wrap">{selectedSubmission.injuries || 'None reported'}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-gray-700 mb-2">Availability</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedSubmission.availability && Array.isArray(selectedSubmission.availability) ? (
                                            selectedSubmission.availability.map((time, i) => (
                                                <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">{time}</span>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 italic">No availability selected</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-gray-700 mb-2">Additional Info</p>
                                    <p className="p-3 bg-gray-50 rounded-md text-gray-800 whitespace-pre-wrap">{selectedSubmission.additional_info || 'None'}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <EyeIcon className="h-12 w-12 mb-2 opacity-50" />
                            <p>Select a submission to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IntakeSubmissions;

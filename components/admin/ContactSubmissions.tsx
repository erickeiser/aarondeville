
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { TrashIcon } from '../Icons';

interface Submission {
    id: number;
    created_at: string;
    name: string;
    email: string;
    subject: string;
    message: string;
}

const ContactSubmissions: React.FC = () => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSubmissions = useCallback(async () => {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
            .from('contact_submissions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching submissions:', error);
            setError('Failed to load submissions. Please check the browser console for details.');
        } else {
            setSubmissions(data);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
            const { error } = await supabase
                .from('contact_submissions')
                .delete()
                .eq('id', id);
            
            if (error) {
                console.error('Error deleting submission:', error);
                setError(`Failed to delete submission: ${error.message}`);
            } else {
                fetchSubmissions(); // Refresh the list
            }
        }
    };
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Contact Form Submissions</h2>

            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                {loading ? <p>Loading submissions...</p> : (
                    submissions.length === 0 ? <p className="text-gray-500">No submissions yet.</p> : (
                        <div className="space-y-4">
                            {submissions.map(sub => (
                                <div key={sub.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-gray-800">{sub.name} <span className="font-normal text-gray-500">&lt;{sub.email}&gt;</span></p>
                                            <p className="text-sm text-gray-500">{new Date(sub.created_at).toLocaleString()}</p>
                                            <p className="text-sm font-semibold text-gray-600 mt-2">Subject: {sub.subject}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(sub.id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                            title="Delete Submission"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <p className="mt-3 text-gray-700 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">{sub.message}</p>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ContactSubmissions;

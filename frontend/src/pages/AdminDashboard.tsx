import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, BookOpen } from 'lucide-react';
import { subjects } from '../lib/api';
import type { Subject } from '../types';
import { Button } from '../components/ui/button';
import { LoadingSpinner } from '../components/ui/loading-spinner';

const SubjectCard = ({ subject }: { subject: Subject }) => (
  <div className="p-6 flex items-start space-x-4">
    <div className="p-2 bg-indigo-50 rounded-lg">
      <BookOpen className="h-6 w-6 text-indigo-600" />
    </div>
    <div>
      <h3 className="text-lg font-medium text-gray-900">{subject.name}</h3>
      <p className="text-gray-600 mt-1">{subject.description}</p>
      <p className="text-sm text-gray-500 mt-2">
        Created on {new Date(subject.createdAt).toLocaleDateString()}
      </p>
    </div>
  </div>
);

const CreateSubjectForm = ({ 
  onSubmit, 
  isLoading
}: { 
  onSubmit: (data: { name: string; description: string }) => void;
  isLoading: boolean;
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Subject</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Subject Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            disabled={isLoading}
          />
        </div>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? <LoadingSpinner className="h-5 w-5 border-white" /> : 'Create'}
        </Button>
      </form>
    </div>
  );
};

export default function AdminDashboard() {
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  const { data: subjectList, isLoading } = useQuery<Subject[]>({
    queryKey: ['subjects'],
    queryFn: subjects.getAll,
  });

  const createMutation = useMutation({
    mutationFn: subjects.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setIsCreating(false);
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <Button 
          variant="primary"
          onClick={() => setIsCreating(true)}
          icon={<PlusCircle className="h-5 w-5" />}
        >
          Create Subject
        </Button>
      </div>

      {isCreating && (
        <CreateSubjectForm
          onSubmit={createMutation.mutate}
          isLoading={createMutation.isPending}
        />
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Existing Subjects</h2>
        </div>
        <div className="divide-y">
          {subjectList?.map((subject) => (
            <SubjectCard key={subject._id} subject={subject} />
          ))}
        </div>
      </div>
    </div>
  );
}
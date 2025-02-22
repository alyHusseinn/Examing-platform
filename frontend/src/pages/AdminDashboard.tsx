import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, BookOpen, Trash2 } from 'lucide-react';
import { subjects } from '../lib/api';
import type { Subject } from '../types';
import { Button } from '../components/ui/button';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { useNavigate } from 'react-router-dom';

const SubjectCard = ({ subject, onDelete }: { subject: Subject; onDelete: (id: string) => void }) => (
  <div className="p-6 flex items-start justify-between border border-gray-200">
    <div className="flex items-start space-x-4">
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
    <button
      onClick={() => onDelete(subject._id)}
      className="text-red-600 hover:text-red-800 transition-colors"
      title="Delete subject"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  </div>
);

const CreateSubjectForm = ({ 
  onSubmit, 
  isLoading,
  error
}: { 
  onSubmit: (data: { name: string; description: string }) => void;
  isLoading: boolean;
  error?: string;
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Create New Subject</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}
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
            className="mt-1 block w-full rounded-md border-indigo-300 border-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="mt-1 block w-full rounded-md border-indigo-300 border-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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

const DeleteConfirmationCard = ({ 
  subject, 
  onConfirm, 
  onCancel, 
  isLoading 
}: { 
  subject: Subject;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  return (
    <div ref={cardRef} className="bg-white rounded-lg shadow-md p-6 space-y-4 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">Confirm Deletion</h2>
      <p className="text-gray-600">
        Are you sure you want to delete "{subject.name}"? This will also delete all associated exams and progress data.
      </p>
      <div className="flex space-x-4">
        <Button
          variant="destructive"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner className="h-5 w-5 border-white" /> : 'Delete'}
        </Button>
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [isCreating, setIsCreating] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: subjectList, isLoading } = useQuery<Subject[]>({
    queryKey: ['subjects'],
    queryFn: subjects.getAll,
  });

  const createMutation = useMutation({
    mutationFn: subjects.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setIsCreating(false);
      navigate(`/subjects/${data.id}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: subjects.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });

  const handleDelete = async (id: string) => {
    const subject = subjectList?.find(s => s._id === id);
    if (subject) {
      setSubjectToDelete(subject);
    }
  };

  const confirmDelete = () => {
    if (subjectToDelete) {
      deleteMutation.mutate(subjectToDelete._id);
      setSubjectToDelete(null);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
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
          error={createMutation.error?.message}
        />
      )}

      {subjectToDelete && (
        <DeleteConfirmationCard
          subject={subjectToDelete}
          onConfirm={confirmDelete}
          onCancel={() => setSubjectToDelete(null)}
          isLoading={deleteMutation.isPending}
        />
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Existing Subjects</h2>
        </div>
        <div className="divide-y">
          {subjectList?.map((subject) => (
            <SubjectCard 
              key={subject._id} 
              subject={subject} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
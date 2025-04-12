import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Filter, Plus, Search } from 'lucide-react';
import { CandidateTable } from './components/CandidateTable';
import { AddCandidateModal } from './components/AddCandidateModal';
import { FilterModal, FilterOptions } from './components/FilterModal';
import type { Candidate, AddCandidateFormData } from './types';

const ITEMS_PER_PAGE = 10;

// Sample data
const initialCandidates: Candidate[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '123-456-7890',
    email: 'john@example.com',
    gender: 'Male',
    experience: '3 Years',
    skills: ['JavaScript', 'React', 'Node.js'],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '098-765-4321',
    email: 'jane@example.com',
    gender: 'Female',
    experience: '5+ Years',
    skills: ['Python', 'AWS', 'Docker'],
    created_at: new Date().toISOString()
  }
];

function App() {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    gender: '',
    experience: '',
    skills: []
  });

  useEffect(() => {
    let result = [...candidates];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(candidate =>
        candidate.name.toLowerCase().includes(query) ||
        candidate.email.toLowerCase().includes(query) ||
        candidate.phone.includes(query)
      );
    }

    // Apply filters
    if (filters.gender) {
      result = result.filter(candidate => candidate.gender === filters.gender);
    }
    if (filters.experience) {
      result = result.filter(candidate => candidate.experience === filters.experience);
    }
    if (filters.skills.length > 0) {
      result = result.filter(candidate =>
        filters.skills.every(skill => candidate.skills.includes(skill))
      );
    }

    setFilteredCandidates(result);
    setCurrentPage(1);
  }, [searchQuery, filters, candidates]);

  const handleAddCandidate = async (formData: AddCandidateFormData) => {
    try {
      const newCandidate: Candidate = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString()
      };

      setCandidates(prev => [newCandidate, ...prev]);
      toast.success('Candidate added successfully');
    } catch (error) {
      console.error('Error adding candidate:', error);
      toast.error('Failed to add candidate');
    }
  };

  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Candidate Management</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={20} />
            Add Candidate
          </button>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <Filter size={20} />
            Filter
          </button>
        </div>

        <CandidateTable
          candidates={paginatedCandidates}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <AddCandidateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCandidate}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={setFilters}
        initialFilters={filters}
      />

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
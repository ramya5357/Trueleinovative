export interface Candidate {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  experience: string;
  skills: string[];
  created_at: string;
}

export interface AddCandidateFormData {
  name: string;
  phone: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  experience: string;
  skills: string[];
}
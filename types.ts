
export enum UserRole {
  ADMIN = 'admin',
  INTERN = 'intern'
}

export enum SubmissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum ApplicationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

export interface Badge {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Only for admin reference/setup
  role: UserRole;
  createdAt: string;
  bio?: string;
  avatar?: string;
  badges?: string[];
  certificate?: {
    dataUrl: string;
    fileName: string;
    issuedAt: string;
    message?: string;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  maxScore: number;
  createdAt: string;
}

export interface Submission {
  id: string;
  userId: string;
  taskId: string;
  title: string;
  description: string;
  githubUrl: string;
  files: Array<{ name: string; dataUrl: string }>;
  status: SubmissionStatus;
  score?: number;
  remarks?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface Application {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  portfolio: string;
  message?: string;
  status: ApplicationStatus;
  createdAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  type: 'doubt' | 'feedback' | 'help' | 'other';
  message: string;
  status: 'pending' | 'answered';
  answer?: string;
  createdAt: string;
  answeredAt?: string;
}

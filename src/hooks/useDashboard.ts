import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useStudentDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'student'],
    queryFn: async () => {
      const response = await api.get('/api/dashboard/student');
      return response.data.data;
    }
  });
};

export const useTeacherDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'teacher'],
    queryFn: async () => {
      const response = await api.get('/api/dashboard/teacher');
      return response.data.data;
    }
  });
};

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: async () => {
      const response = await api.get('/api/dashboard/admin');
      return response.data.data;
    }
  });
};

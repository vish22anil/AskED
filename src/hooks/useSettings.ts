import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { bio?: string, theme?: string, emailNotifs?: boolean }) => {
      const response = await api.put('/api/users/settings', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    }
  });
};

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { profileImage: string }) => {
      const response = await api.put('/api/users/avatar', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    }
  });
};

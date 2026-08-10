import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useToggleVote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { questionId?: string, answerId?: string, isUpvote: boolean }) => {
      const response = await api.post('/api/interactions/vote', data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      if (variables.questionId) {
        queryClient.invalidateQueries({ queryKey: ['questions', variables.questionId] });
      }
    }
  });
};

export const useToggleBookmark = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { questionId: string }) => {
      const response = await api.post('/api/interactions/bookmark', data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['questions', variables.questionId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { questionId?: string, answerId?: string, content: string }) => {
      const response = await api.post('/api/interactions/comment', data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      if (variables.questionId) {
        queryClient.invalidateQueries({ queryKey: ['questions', variables.questionId] });
      }
    }
  });
};

export const useAcceptAnswer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (answerId: string) => {
      const response = await api.patch(`/api/answers/${answerId}/accept`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    }
  });
};

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useQuestions = (filters: any) => {
  return useInfiniteQuery({
    queryKey: ['questions', filters],
    queryFn: async ({ pageParam = null }) => {
      const response = await api.get('/api/questions', { 
        params: { ...filters, cursor: pageParam } 
      });
      return response.data.data; // { questions, nextCursor, total }
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};

export const useQuestion = (id: string) => {
  return useQuery({
    queryKey: ['questions', id],
    queryFn: async () => {
      const response = await api.get(`/api/questions/${id}`);
      return response.data.data;
    },
    enabled: !!id
  });
};

export const useAskQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { title: string, description: string, subjectId: string, tags: string[] }) => {
      const response = await api.post('/api/questions', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });
};

export const usePostAnswer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { questionId: string, content: string }) => {
      const response = await api.post('/api/answers', data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['questions', variables.questionId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });
};

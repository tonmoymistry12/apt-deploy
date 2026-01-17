import http from '@/common/http';

interface ForgotPasswordResponse {
  message:string;
  status:string
}

interface ForgotPasswordPayload {
    userName:string;
  }

export const forgotPasswordService = async (userName: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
  try {
    const { data } = await http.post<ForgotPasswordResponse>('/forgotPassword', userName);
      
    return data;
  } catch (error) {
    throw error;
  }
};

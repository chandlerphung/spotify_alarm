import axios, { AxiosError } from 'axios';

interface UserData {
  _id: string;
  spotify_id: string;
  display_name: string;
  access_token: string;
  refresh_token: string;
  scope: string;
  token_expires_at: string;
  playlists: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UserServiceConfig {
  baseURL: string;
  token: string;
}

class UserService {
  private baseURL: string;
  private token: string;

  constructor(config: UserServiceConfig) {
    this.baseURL = config.baseURL;
    this.token = config.token;
  }

  async getUserBySpotifyId(spotify_id: string): Promise<UserData> {
    try {
      const response = await axios.get<UserData>(`${this.baseURL}/users/${spotify_id}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error: string }>;

        if (axiosError.response?.status === 403) {
          throw new Error('Unauthorized: Cannot access this user data');
        }

        if (axiosError.response?.status === 404) {
          throw new Error('User not found');
        }

        throw new Error(axiosError.response?.data?.error || 'Failed to fetch user data');
      }

      throw new Error('An unexpected error occurred');
    }
  }
}

export { UserService };
export type { UserData, UserServiceConfig };

// Usage example:
// const userService = new UserService({
//   baseURL: 'http://localhost:3000/api',
//   token: 'your-jwt-token-here'
// });
//
// const user = await userService.getUserBySpotifyId('31zfbrmo7ppypcv7vvevkc43bzwe');

import axios from "axios";

const API_URL_LOCAL = "http://localhost:5291/api/Match";

// Swipe API
export const swipeProfile = async (accountId: number, swipedProfileId: number, swipeAction: boolean) => {
  try {
    // Validate input parameters
    if (!accountId || isNaN(accountId)) {
      throw new Error('AccountId không hợp lệ');
    }
    if (!swipedProfileId || isNaN(swipedProfileId)) {
      throw new Error('SwipedProfileId không hợp lệ');
    }
    if (typeof swipeAction !== 'boolean') {
      throw new Error('SwipeAction phải là boolean');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Không tìm thấy token');
    }

    // Log request data for debugging
    console.log('Swipe request data:', {
      accountId,
      swipedProfileId,
      swipeAction
    });

    // Create a simple DTO object without circular references
    const swipeDto = {
      accountId: Number(accountId),
      swipedProfileId: Number(swipedProfileId),
      swipeAction: Boolean(swipeAction)
    };

    const response = await axios.post(`${API_URL_LOCAL}/swipe`, swipeDto, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Handle the response data
    if (response.data) {
      // If the response contains conversation data, it's a match
      if (response.data.id) {
        return {
          isMatch: true,
          conversation: {
            id: response.data.id,
            user1Id: response.data.user1Id,
            user2Id: response.data.user2Id,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt
          }
        };
      }
      
      // If not a match, return swipe data
      return {
        isMatch: false,
        swipe: {
          accountId: response.data.accountId,
          swipedAccountId: response.data.swipedAccountId,
          swipeAction: response.data.swipeAction,
          swipedAt: response.data.swipedAt
        }
      };
    }
    return { isMatch: false };
  } catch (error: any) {
    // Log detailed error information
    console.error('Swipe error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    // Format error message for display
    if (error.response?.data) {
      const errorData = error.response.data;
      
      // Log full error data for debugging
      console.log('Full error data:', errorData);
      
      if (errorData.errors) {
        // Handle validation errors
        const validationErrors = Object.entries(errorData.errors)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        throw new Error(`Lỗi validation: ${validationErrors}`);
      }
      
      if (typeof errorData === 'string') {
        throw new Error(errorData);
      }
      
      if (errorData.message) {
        throw new Error(errorData.message);
      }
    }
    throw new Error('Có lỗi xảy ra khi thực hiện swipe');
  }
};

// Get today's swipe count
export const getTodaySwipeCount = async (accountId: number) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Không tìm thấy token');
    }

    const response = await axios.get(`${API_URL_LOCAL}/SwipeCount/${accountId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Get swipe count error:', error.response?.data);
    throw new Error('Không thể lấy số lượt swipe hôm nay');
  }
};

// Get users who liked you
export const getSwipers = async (accountId: number) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Không tìm thấy token');
    }

    const response = await axios.get(`${API_URL_LOCAL}/swipers/${accountId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Get swipers error:', error.response?.data);
    if (error.response?.status === 404) {
      return [];
    }
    throw new Error('Không thể lấy danh sách người đã thích bạn');
  }
};

// Get users you liked
export const getSwiped = async (accountId: number) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Không tìm thấy token');
    }

    const response = await axios.get(`${API_URL_LOCAL}/swiped/${accountId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Get swiped error:', error.response?.data);
    if (error.response?.status === 404) {
      return [];
    }
    throw new Error('Không thể lấy danh sách người bạn đã thích');
  }
};

// Get your matches
export const getMatches = async (accountId: number) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Không tìm thấy token');
    }

    const response = await axios.get(`${API_URL_LOCAL}/matches/${accountId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Get matches error:', error.response?.data);
    if (error.response?.status === 404) {
      return [];
    }
    throw new Error('Không thể lấy danh sách match');
  }
};
import {
    ERROR_MSG_API_COMMENT_VALIDATE_DEPENDENCE,
    ERROR_MSG_API_DELETE_COMMENT,
    ERROR_MSG_API_GET_COMMENT,
    ERROR_MSG_API_POST_COMMENT,
    ERROR_MSG_API_PUT_COMMENT,
    ERROR_MSG_INTERNET
} from "../const/messages";

import { BACKEND_URL } from "../const/config";
import axios from 'axios';

export const getAllComments = async () => {
  try {
      let response = await axios.get(`${BACKEND_URL}/comments`,
          {
              headers: {
                  Authorization: `none`
              }
          });
      return response;
  } catch (error) {
      if (error.response?.status) {
          return error.response;
      } else {
          // In this situation, is NOT an axios handled error
          console.log(`${ERROR_MSG_API_GET_COMMENT} ${error}`);

          if (error.message === 'Network Error') {
              error.message = ERROR_MSG_INTERNET;
              return error.message;
          } else {
              return error.message;
          }
      }
  }
}

export const getLatestComments = async () => {
  try {
      let response = await axios.get(`${BACKEND_URL}/comments/custom/latest`,
          {
              headers: {
                  Authorization: `none`
              }
          });
      return response;
  } catch (error) {
      if (error.response?.status) {
          return error.response;
      } else {
          // In this situation, is NOT an axios handled error
          console.log(`${ERROR_MSG_API_GET_COMMENT} ${error}`);

          if (error.message === 'Network Error') {
              error.message = ERROR_MSG_INTERNET;
              return error.message;
          } else {
              return error.message;
          }
      }
  }
}
export const getComments = async (id) => {
    console.log(id);
    const token = localStorage.getItem('token');
    try {
        let response = await axios.get(`${BACKEND_URL}/comments/custom/user/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return response;
    } catch (error) {
        if (error.response?.status) {
            return error.response;
        } else {
            // In this situation, is NOT an axios handled error

            console.log(`${ERROR_MSG_API_GET_COMMENT} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
}

export const postComments = async (comment, id) => {
    const token = localStorage.getItem('token');
    console.log(comment, id);
    const newComment = {
        comment,
    }
    try {
        let response = await axios.post(`${BACKEND_URL}/comments/custom/user/${id}`,
        newComment,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return response;
    } catch (error) {
        if (error.response?.status) {
            return error.response;
        } else {
            // In this situation, is NOT an axios handled error

            console.log(`${ERROR_MSG_API_POST_COMMENT} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
}

export const putComments = async (comment, id) => {
    const token = localStorage.getItem('token');
    const modifyComment = {
        comment,
    }
    try {
        let response = await axios.put(`${BACKEND_URL}/comments/${id}`,
        modifyComment,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return response;
    } catch (error) {
        if (error.response?.status) {
            return error.response;
        } else {
            // In this situation, is NOT an axios handled error

            console.log(`${ERROR_MSG_API_PUT_COMMENT} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
}
export const deleteComments = async (id) => {
    const token = localStorage.getItem('token');
    try {
        let response = await axios.delete(`${BACKEND_URL}/comments/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return response;
    } catch (error) {
        if (error.response?.status) {
            return error.response;
        } else {
            // In this situation, is NOT an axios handled error

            console.log(`${ERROR_MSG_API_DELETE_COMMENT} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
}
export const unDeleteComments = async (id) => {
    const token = localStorage.getItem('token');
    try {
        let response = await axios.put(`${BACKEND_URL}/comments/custom/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return response;
    } catch (error) {
        if (error.response?.status) {
            return error.response;
        } else {
            // In this situation, is NOT an axios handled error

            console.log(`${ERROR_MSG_API_PUT_COMMENT} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
}

export const getCommentDependenceById = async (id) => {
    const token = localStorage.getItem('token');
    try {
        let response = await axios.get(`${BACKEND_URL}/comments/custom/commentDependenceById/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

        return response;
    } catch (error) {
        if (error.response?.status) {
            return error.response;
        } else {
            // In this situation, is NOT an axios handled error

            console.log(`${ERROR_MSG_API_COMMENT_VALIDATE_DEPENDENCE} ${error}`);

            if (error.message === 'Network Error') {
                error.message = ERROR_MSG_INTERNET;
                return error.message;
            } else {
                return error.message;
            }
        }
    }
};
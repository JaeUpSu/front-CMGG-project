import axios, { AxiosInstance, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { getAccessToken } from "./Token";

import { QueryFunctionContext } from "@tanstack/react-query";
export interface UserNameLoginParams {
  username: string;
  password: string;
  headers?: {
    Authorization: string;
    "X-Refresh-Token": string;
  };
}

interface PostRefreshTokenParams {
  refresh: string;
  access: string;
}

interface LectureAndCategoryAndSearchParams {
  queryKey: string[];
}

export interface PostReviewParams {
  lectureNum: number;
  data: FormData;
}

export interface PostReplyParams {
  lectureNum: number;
  reviewNum: number;
  data: {
    content: string;
  };
}

export interface FetchVideoListParams {
  lectureId: string;
  num: string;
}

export interface SavePlayedSecondsParams {
  lectureId: string;
  num: string;
  lastPlayed: number;
}

export interface WatchedLectures80Params {
  lectureId: string;
  num: string;
  is_completed: boolean;
  lastPlayed?: number;
}

type AccessToken = string;
type RefreshToken = string;

interface UserData {
  username: string;
  email: string;
  password: string;
  passwordCheck: string;
  name: string;
  dateBirth: string;
  gender: string;
  phoneNumber: string;
  position: string;
  skill: string;
  termsOfUse: String;
}

export const instance: AxiosInstance = axios.create({
  baseURL: "https://crazyform.store/api/v1/",
  headers: {
    "X-CSRFToken": Cookies.get("csrftoken"),
    Authorization: "Bearer " + Cookies.get("access"),
  },
  withCredentials: true,
});

export const instanceNotLogin = axios.create({
  baseURL: "https://crazyform.store/api/v1/",
  // baseURL: 'http://115.85.182.132:8000/api/v1/',

  headers: {
    "X-CSRFToken": Cookies.get("csrftoken"),
  },
  withCredentials: true,
});

export const getLectureAndCategoryAndSearch = ({
  queryKey,
}: QueryFunctionContext) => {
  const [, bigCategory, smallCategory, pageNum, searchName] = queryKey;

  if (searchName) {
    return instanceNotLogin
      .get(
        `lectures/${bigCategory}/${smallCategory}/?page=${pageNum}&search=${searchName}`
      )
      .then((res) => res.data);
  } else {
    return instanceNotLogin
      .get(`lectures/${bigCategory}/${smallCategory}/?page=${pageNum}`)
      .then((res) => res.data);
  }
};
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get("refresh");
      const accessToken = Cookies.get("access");

      if (refreshToken && accessToken) {
        const newAccessToken = await postRefreshToken(
          refreshToken,
          accessToken
        );

        if (newAccessToken) {
          Cookies.set("access", newAccessToken);

          instance.defaults.headers["Authorization"] =
            "Bearer " + newAccessToken;
          originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;

          return instance(originalRequest);
        } else {
          window.location.href =
            "https://crazyform.store/api/v1/users/jwt-token-auth/";
          return Promise.reject(error);
        }
      } else {
        window.location.href =
          "https://crazyform.store/api/v1/users/jwt-token-auth/";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export async function userNameLogin(
  { username, password }: UserNameLoginParams,
  headers?: {
    Authorization: string;
    "X-Refresh-Token": string;
  }
): Promise<boolean> {
  const response = await fetch(
    "https://crazyform.store/api/v1/users/jwt-token-auth/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    }
  );

  if (response.ok) {
    const data = await response.json();
    const refresh = data.refresh;
    const access = data.access;

    Cookies.set("access", access);
    Cookies.set("refresh", refresh);

    return true;
  } else {
    const { message } = await response.json();
    throw new Error(message);
  }
}

export async function postRefreshToken(
  refresh: RefreshToken,
  access: AccessToken
): Promise<string | null> {
  try {
    const response = await axios.post(
      "https://crazyform.store/api/v1/users/jwt-token-auth/refresh/",
      {
        refresh,
        access,
      }
    );
    return response.data.access;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}
export const signUpUser = (data: UserData) => {
  return instanceNotLogin.post("users/", data).then((res) => res.data);
};

export const getMyProfile = () => {
  return instance.get("users/myprofile").then((res) => res.data);
};
export const changeProfileUser = (data: UserData) => {
  return instance.put("users/myprofile", data).then((res) => res.data);
};
export const getLectureInfo = () => {
  return instance.get(`users/myprofile`).then((res) => res.data);
};

export const getAllLectures = () =>
  instanceNotLogin.get("lectures/all/all").then((res) => res.data);

// export const getLectureDetail = (page: number) => {
//   return instanceNotLogin.get(`lectures/${page}`).then((res) => res.data);
// };

export const getLectureDetail = async (page: number) => {
  const access = getAccessToken();
  try {
    if (access) {
      const res = await instance.get(`lectures/${page}`);
      return res.data;
    } else {
      const res = await instanceNotLogin.get(`lectures/${page}`);
      return res.data;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const postReview = ({ lectureNum, data }: PostReviewParams) => {
  return instance.post(`reviews/${lectureNum}`, data).then((res) => res.data);
};
export const postReply = ({ lectureNum, reviewNum, data }: PostReplyParams) => {
  return instance
    .post(`reviews/${lectureNum}/${reviewNum}`, data)
    .then((res) => res.data);
};

export const registerLecture = (lectureNum: number) => {
  return instance
    .put(`users/calculated-lectures/${lectureNum}/`, "")
    .then((res) => res.status);
};

export const fetchVideoList = async ({
  lectureId,
  num,
}: FetchVideoListParams) => {
  return await instance
    .get(`videos/lectures/${lectureId}/${num}`)
    .then((res) => res.data);
};

export const savePlayedSeconds = ({
  lectureId,
  num,
  lastPlayed,
}: SavePlayedSecondsParams) => {
  // console.log("saveVideo", lectureId, num, lastPlayed);
  return instance
    .put(`watchedlectures/${lectureId}/${num}`, { lastPlayed })
    .then((res) => res.data);
};

export const watchedlectures80 = ({
  lectureId,
  num,
  is_completed,
  lastPlayed,
}: WatchedLectures80Params) => {
  // console.log("watchVideo", lectureId, num, is_completed, lastPlayed);

  return instance
    .put(`watchedlectures/${lectureId}/${num}`, { is_completed, lastPlayed })
    .then((res) => res.data);
};

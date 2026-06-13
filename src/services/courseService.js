import API from "./api";

export const getCourses = async () => {
  const response = await API.get("/courses");
  return response.data.courses;
};
import Mock from "../mock";
import hrData from "../../assets/data/HR.json";

Mock.onGet("/api/hr/all").reply(() => {
  const response = hrData.departments;
  return [200, response];
});

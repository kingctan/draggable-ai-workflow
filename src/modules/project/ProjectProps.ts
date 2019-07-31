export type ProjectProps = {
  id: number;          // id
  name: string;        // 项目名
  bizModel: string;    // 业务模块
  projectDesc: string; // 项目介绍
  admin: string[],     // 项目管理员
  members: string[],   // 项目成员
};
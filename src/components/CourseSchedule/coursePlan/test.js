export const planInfo = {
  id: "123",
  planName: "测试教学方案",
  projectId: "关联项目id",
  startDatetime: "1598944357000",
  endDatetime: "1601449957000",
  courseEntities: [
    {
      name: "测试课程一",
      startDatetime: "1599025582000",
      endDatetime: "1599889582000",
      times: 3,
      id: "1",
      schedules: [], //具体课程安排
    },
    {
      name: "测试课程二",
      startDatetime: "1599284782000",
      endDatetime: "1600580782000",
      times: 3,
      id: "2",
      schedules: [
        {
          startTime: "1600131600000",
          endTime: "1600135200000",
          location: "二教304",
        },
      ], //具体课程安排
    },
  ],
};

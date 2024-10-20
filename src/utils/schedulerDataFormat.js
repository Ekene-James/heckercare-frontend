const apiData = [
  {
    day: 7,
    startTime: 1,
    endTime: 2,
    staffList: [
      {
        name: "Adedamola Smith",
        img: "",
      },
      {
        name: "Francis Sani",
        img: "",
      },
      {
        name: "Grace Adejare",
        img: "",
      },
      {
        name: "Exodus Eket",
        img: "",
      },
      {
        name: "Badmus Ukwu",
        img: "",
      },
      {
        name: "Adedamola Smith",
        img: "",
      },
    ],
    otherData: "",
  },
  {
    day: 11,
    startTime: 17,
    endTime: 18,
    otherData: "",
    staffList: [
      {
        name: "Adedamola Smith",
        img: "",
      },
      {
        name: "Francis Sani",
        img: "",
      },
      {
        name: "Grace Adejare",
        img: "",
      },
      {
        name: "Exodus Eket",
        img: "",
      },
      {
        name: "Badmus Ukwu",
        img: "",
      },
      {
        name: "Adedamola Smith",
        img: "",
      },
    ],
  },
  {
    day: 9,
    startTime: 21,
    endTime: 22,
    otherData: "",
    staffList: [
      {
        name: "Adedamola Smith",
        img: "",
      },
      {
        name: "Francis Sani",
        img: "",
      },
      {
        name: "Grace Adejare",
        img: "",
      },
      {
        name: "Exodus Eket",
        img: "",
      },
      {
        name: "Badmus Ukwu",
        img: "",
      },
      {
        name: "Adedamola Smith",
        img: "",
      },
    ],
  },
];

export const staffShiftFormat = (data) => {
  return data.map((d) => {
    const dDate = new Date(data.date);

    const startTime = data.shift.startTime.split(":");
    const startHour = +startTime[0];
    const startMin = +startTime[1];
    const st = `${startHour}.${startMin}`;

    const endTime = data.shift.startTime.split(":");
    const endHour = +endTime[0];
    const endMin = +endTime[1];
    const et = `${endHour}.${endMin}`;

    return {
      _id: d._id,
      day: dDate.getDate(),
      startTime: st,
      endTime: et,
      otherData: "",
    };
  });
};

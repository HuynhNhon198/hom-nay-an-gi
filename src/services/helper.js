/*global chrome*/

export function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export const Purpose = [
  {
    name: "Giảm cân",
    id: "5",
  },
  {
    name: "Tăng cân",
    id: "21",
  },
  {
    name: "Cho phái mạnh",
    id: "6",
  },
  {
    name: "Cho phái nữ",
    id: "19",
  },
  {
    name: "Cho trẻ em",
    id: "17",
  },
  {
    name: "Trẻ dưới 1 tuổi",
    id: "14",
  },
  {
    name: "Ăn chay",
    id: "9",
  },
  {
    name: "Tốt cho tim mạch",
    id: "18",
  },
  {
    name: "Phụ nữ mang thai",
    id: "13",
  },
  {
    name: "Phụ nữ sau sinh",
    id: "12",
  },
  {
    name: "Cuối tháng :((",
    key: "crs",
    id: "6",
  },
];

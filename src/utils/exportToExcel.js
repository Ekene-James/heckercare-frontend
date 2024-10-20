import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import { baseURL } from "./axios-utils";
import secureLocalStorage from "react-secure-storage";

const fileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTf-8";
const fileExtention = ".xlsx";
export const exportToExcel = (data, filename) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const excelData = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(excelData, filename + fileExtention);
};

export const downloadOnClick = (
  fileUrl,
  fileName,
  method = "GET",
  data = {},
  cb = (res) => {}
) => {
  if (!fileUrl || !fileName) return;

  const userData = secureLocalStorage.getItem("hms_user");
  let auth = null;
  if (userData) {
    const { token } = userData;
    auth = `Bearer ${token}`;
  }

  fetch(fileUrl, {
    method,
    body: method !== "GET" ? JSON.stringify(data) : null,
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
    },
  })
    .then((res) => {
      return res.blob();
    })
    .then((str) => {
      var url = window.URL || window.webkitURL;
      var link = url.createObjectURL(str);
      var a = document.createElement("a");
      a.setAttribute(
        "download",
        `${fileName || "downloaded at" + new Date().getTime()}`
      );
      a.setAttribute("href", link);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(link);
      cb(true);
    })
    .catch((err) => {
      cb(false);
      console.log(err);
    });
};

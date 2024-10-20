import { groupBy } from "utils/groupByFunc";

export const markSelectedText = (el, search) => {
  if (search.length === 0) return;
  let innerHTML = el.innerHTML.toLocaleLowerCase();
  const searchStrLowerCase = search.toLocaleLowerCase();
  const indices = [];

  //get all indices of the word
  let startIndx = 0,
    indx;
  while ((indx = innerHTML.indexOf(searchStrLowerCase, startIndx)) > -1) {
    indices.push(indx);
    startIndx = indx + search.length;
  }

  if (!indices.length) return;

  // the length of <mark></mark>
  const marksTagLength = 13;

  indices.forEach((indx, i) => {
    innerHTML =
      innerHTML.substring(0, indx + i * marksTagLength) +
      "<mark>" +
      innerHTML.substring(
        indx + i * marksTagLength,
        indx + search.length + i * marksTagLength
      ) +
      "</mark>" +
      innerHTML.substring(indx + search.length + i * marksTagLength);
  });

  el.innerHTML = innerHTML;
};

export const searchForText = (setfoundElements, search) => {
  if (!search) return;
  const assesmentReportTitles = document.querySelectorAll(
    ".assesment_report_title"
  );
  const assesmentReportMsgs = document.querySelectorAll(
    ".assesment_report_message"
  );
  const assesmentReportTags = document.querySelectorAll(
    ".assesment_report_tag"
  );
  const selfMsgs = document.querySelectorAll(".self_message");
  const othersMsgs = document.querySelectorAll(".others_message");

  assesmentReportTitles.forEach((el) => {
    if (
      el.textContent.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    ) {
      markSelectedText(el, search);
      setfoundElements((prev) => [...prev, el]);
    }
  });

  assesmentReportMsgs.forEach((el) => {
    if (
      el.textContent.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    ) {
      markSelectedText(el, search);
      const occurance = el.textContent.split(search).length - 1;

      const data = [];
      for (let i = 0; i < occurance; i++) {
        data.push(el);
      }
      setfoundElements((prev) => [...prev, ...data]);
    }
  });

  assesmentReportTags.forEach((el) => {
    if (
      el.textContent.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    ) {
      markSelectedText(el, search);
      setfoundElements((prev) => [...prev, el]);
    }
  });

  selfMsgs.forEach((el) => {
    if (
      el.textContent.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    ) {
      markSelectedText(el, search);
      setfoundElements((prev) => [...prev, el]);
    }
  });

  othersMsgs.forEach((el) => {
    if (
      el.textContent.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    ) {
      markSelectedText(el, search);
      setfoundElements((prev) => [...prev, el]);
    }
  });
};

export const formatAssesmentLog = (data) => {
  if (!data?.length)
    return {
      dates: [],
      data: {},
    };
  const hasOnlyDate = data.map((d) => ({
    ...d,
    dateOnly: d.createdAt.split("T")[0],
  }));

  const grouped = groupBy(hasOnlyDate, "dateOnly");
  const dates = Object.keys(grouped);

  return {
    dates,
    data: grouped,
  };
};

import * as XLSX from "xlsx";

const exportToExcel = (entries: any) => {
  const rows: any[] = [];

  Object.entries(entries).forEach(([date, dayEntries]: any) => {
    dayEntries.forEach((entry: any) => {
      let hours = entry.hours || 0;

      if (entry.startTime && entry.endTime) {
        const [sh, sm] = entry.startTime.split(":").map(Number);
        const [eh, em] = entry.endTime.split(":").map(Number);

        const start = new Date(0, 0, 0, sh, sm);
        const end = new Date(0, 0, 0, eh, em);

        hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }

      rows.push({
        Datum: date,
        Typ: entry.type,
        Start: entry.startTime || "",
        Slut: entry.endTime || "",
        Timmar: Number(hours.toFixed(2)),
      });
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Tid");

  XLSX.writeFile(workbook, "tidsrapport.xlsx");
};

export default exportToExcel;
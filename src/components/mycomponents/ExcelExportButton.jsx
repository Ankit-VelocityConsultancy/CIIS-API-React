import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { Button } from "../ui/button";

export const ExcelExportButton = ({ excelData, fileName, children }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    // XLSX.utils.sheet_add_aoa(ws, [["Name/Description", "E-Mail", "Date Generated", "Amount", "Transaction ID", "Link" , "Status"]], { origin: "A1" });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <Button onClick={exportToExcel}>{children || "Export to Excel"}</Button>
  );
};

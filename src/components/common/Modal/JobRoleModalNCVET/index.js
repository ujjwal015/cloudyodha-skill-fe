import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CustomTable from "../../CustomTableForNCEVT";
import JobRoleTable from "../JobRoleTable";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "1px solid white",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

export default function JobRoleViewModalNCVET({ open, handleClose,data=[],clientNameOfJobRoleList="" }) {
  const [loading, setLoading] = React.useState(false);

  const headerColumns = React.useMemo(() => {
    return [
      {
        name: "jobRole",
        label: "JOBROLE",
        sorting: false,
        selector: (row) => (
          <div style={{ padding: "10px", fontWeight: "bold" }}>
            {row.jobRole || ""}
          </div>
        ),
      },
      {
        name: "qpCode",
        label: "QUALIFICATION PACK(QP Code)",
        sorting: false,
        selector: (row) => (
          <div style={{ padding: "10px", fontWeight: "bold" }}>
            {row.qpCode || ""}
          </div>
        ),
      },
    ];
  }, []);

  const table = React.useMemo(() => {
    return {
      isPermission: true,
      headerColumn: headerColumns,
      bodyData: [
        { jobRole: "HHH", qpCode: "RAS-1232" },
        { jobRole: "AA", qpCode: "RAS-1332" },
        { jobRole: "DR", qpCode: "RAS-4893" },
        { jobRole: "FKS", qpCode: "RAS-9392" },
        { jobRole: "KKW", qpCode: "RAS-3920" },
      ],
      isCheckBox: false,
      // selectedCheckBoxs: checkedRows,
      canDeleteAllSelectedBox: false,
    };
  }, [headerColumns]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{sx:{borderRadius:5}}}
        scroll="paper"
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogTitle>
          <h1 style={{ fontWeight: "bold", marginBottom: "5px" }}>
            {clientNameOfJobRoleList}
          </h1>
          <p
            style={{ fontSize: "14px", color: "#475467", marginBottom: "5px" }}
          >
            Number of associated Job Role List: {data.length || 0}
          </p>
        </DialogTitle>

        <DialogContent dividers={"paper"}>
          <JobRoleTable data={data} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

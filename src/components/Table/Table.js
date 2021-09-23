import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
// core components
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";

const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const classes = useStyles();
  const {
    tableHead,
    tableData,
    tableHeaderColor,
    tableChecked,
    tableHeaderIsChecked,
    handleCheckBoxChange,
    handleCheckBoxHeaderChange,
  } = props;

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
            <TableRow className={classes.tableHeadRow}>
              {tableChecked ? (
                <TableCell>
                  <Checkbox
                    onChange={handleCheckBoxHeaderChange}
                    checked={tableHeaderIsChecked}
                  />
                </TableCell>
              ) : null}
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={key}
                  >
                    {prop}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableData.map((prop, key) => {
            return (
              <TableRow key={key} className={classes.tableBodyRow}>
                {tableChecked ? (
                  <TableCell>
                    <Checkbox
                      checked={prop[0]}
                      onChange={handleCheckBoxChange(key)}
                    />
                  </TableCell>
                ) : null}
                {prop.map((prop, key) => {
                  if (key !== 0 || tableChecked !== true) {
                    return (
                      <TableCell className={classes.tableCell} key={key}>
                        {prop}
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray",
};

CustomTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray",
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.array,
  tableChecked: PropTypes.bool,
  tableHeaderIsChecked: PropTypes.bool,
  handleCheckBoxChange: PropTypes.func,
  handleCheckBoxHeaderChange: PropTypes.func,
};

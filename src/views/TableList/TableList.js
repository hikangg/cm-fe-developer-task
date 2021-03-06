import React, { useEffect, useState } from "react";
import axios from "axios";
import localStorageService from "services/localStorageService";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter";
import Button from "components/CustomButtons/Button.js";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);

export default function TableList() {
  const classes = useStyles();
  const [hrList, setHrList] = useState([]); //State for HR data.
  const [userList, setUserList] = useState([]); //State for User Data from random user API.
  const [filteredUserList, setFilteredUserList] = useState([]); //State for user data filtered by department.
  const [tableHeaderIsChecked, setTableHeaderIsChecked] = useState(false); //State for checkbox in table header.

  //Event handler for checkbox in customized table.
  const handleCheckBoxChange = (key) => (event) => {
    var hrListArray = hrList;
    hrListArray[key][0] = event.target.checked;

    //If every check box is true.
    var isAllChecked = true;
    for (let i = 0; i < hrListArray.length; i++) {
      isAllChecked = isAllChecked && hrListArray[i][0];
    }

    if (isAllChecked === true) {
      //When all checkboxes are checked.
      setTableHeaderIsChecked(true);
      localStorageService.setItem("header_check", true);
    } else {
      //Not all checkboxes are checked.
      setTableHeaderIsChecked(false);
      localStorageService.setItem("header_check", false);
    }

    setHrList(hrListArray);
    localStorageService.setItem("hr_list", hrListArray);

    updateFilteredUserList();
  };

  //Event handler for checkbox in table header.
  const handleCheckBoxHeaderChange = (event) => {
    var hrListArray = hrList;
    for (let i = 0; i < hrListArray.length; i++) {
      hrListArray[i][0] = event.target.checked;
    }

    setHrList(hrListArray);
    localStorageService.setItem("hr_list", hrListArray);

    setTableHeaderIsChecked(event.target.checked);
    localStorageService.setItem("header_check", event.target.checked);

    updateFilteredUserList();
  };

  //Update display user list by checked departments.
  const updateFilteredUserList = () => {
    var filteredResult = [];
    for (let i = 0; i < hrList.length; i++) {
      if (hrList[i][0] === true) {
        //Department is checked.
        for (let j = 0; j < userList.length; j++) {
          if (userList[j][5] === hrList[i][2]) {
            //Find user from user list by department.
            filteredResult.push(userList[j]);
          }
        }
      }
    }

    setFilteredUserList(filteredResult);
    localStorageService.setItem("filtered_user", filteredResult);
  };

  //initiate
  const initiateData = () => {
    // Fetch departments
    var hrListArray = [];

    axios.get("/api/hr/all").then((response) => {
      response.data.map((item) => {
        hrListArray.push([
          false,
          item.id + "",
          item.department,
          item.location,
          item.manager.name.first + " " + item.manager.name.last,
        ]);
      });
    });

    setHrList(hrListArray);
    localStorageService.setItem("hr_list", hrListArray);

    // Fetch user from API.
    var userListArray = [];
    axios
      .get(
        process.env.REACT_APP_RANDOMUSER_API + "?seed={department}&results=10"
      )
      .then((response) => {
        response.data.results.map((item) => {
          userListArray.push([
            item.login.username,
            item.name.first + " " + item.name.last,
            item.email,
            item.gender,
            item.location.city +
              ", " +
              item.location.state +
              ", " +
              item.location.country,
            hrListArray[Math.floor(Math.random() * 7)][2],
          ]);
        });

        setUserList(userListArray);
        localStorageService.setItem("user_list", userListArray);
      });

    setFilteredUserList([]);
    localStorageService.setItem("filtered_user", []);

    setTableHeaderIsChecked(false);
    localStorageService.setItem("header_check", false);
  };

  useEffect(() => {
    if (localStorageService.getItem("hr_list")) {
      setHrList(localStorageService.getItem("hr_list"));
      setUserList(localStorageService.getItem("user_list"));
      setFilteredUserList(localStorageService.getItem("filtered_user"));
      setTableHeaderIsChecked(localStorageService.getItem("header_check"));
    } else {
      initiateData();
    }
  }, []);

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>HR Departments Table</h4>
            <p className={classes.cardCategoryWhite}>
              Here is a subtitle for this table
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["ID", "Department", "Location", "Name"]}
              tableData={hrList}
              tableChecked={true}
              tableHeaderIsChecked={tableHeaderIsChecked}
              handleCheckBoxChange={handleCheckBoxChange}
              handleCheckBoxHeaderChange={handleCheckBoxHeaderChange}
            />
          </CardBody>
          <CardFooter>
            <Button color="primary" onClick={initiateData}>
              Refresh Data
            </Button>
          </CardFooter>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card plain>
          <CardHeader plain color="primary">
            <h4 className={classes.cardTitleWhite}>
              Filtered Members By Departments
            </h4>
            <p className={classes.cardCategoryWhite}>
              Here is a subtitle for this table
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={[
                "Username",
                "Name",
                "Email",
                "Gender",
                "Location",
                "Department",
              ]}
              tableData={filteredUserList}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

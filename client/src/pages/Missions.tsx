import { SyntheticEvent, useEffect, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import fetchGraphQL from "../graphql/GraphQL";
import { Mission, Launch, Orbit, Location, Payload } from "../graphql/schema";
import {
  Card, CardHeader, CardActions, CardContent, Button, Grid, Typography, Fab, Dialog, DialogTitle,
  TextField, DialogContent, DialogActions, Toolbar, Container, IconButton, Tooltip, Snackbar, Alert,
  Box, CircularProgress,
} from "@mui/material";

import {
  Add as AddIcon,
  FilterAlt as FilterAltIcon,
  Sort as SortIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
} from "@mui/icons-material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ListMenu } from "../components/ListMenu";
import { MissionDialog } from '../components/MissionDialog';

type SortField = "Title" | "Date" | "Operator";

interface MissionsResponse {
  data: {
    Missions: Mission[];
  };
}

const deleteMission = async (
  id: String
): Promise<Mission> => {
  return await fetchGraphQL(
    `mutation ($id: String!){
      deleteMission(id:$id){
        id
      }
    }
    `,
    { id: id }
  );
};

const getMissions = async (
  sortField: SortField,
  sortDesc: Boolean
): Promise<MissionsResponse> => {
  return await fetchGraphQL(
    `
  {
    Missions(
      sort: { desc: ${sortDesc}, field:${sortField}}
    ) {
      id
      title
      operator
      launch {
        date
      }
    }
  }
  `,
    []
  );
};

const Missions = (): JSX.Element => {
  const [missions, setMissions] = useState<Mission[] | null>(null);
  const [sortDesc, setSortDesc] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>("Title");
  const [errMessage, setErrMessage] = useState<String | null>(null);
  const [action, setAction] = useState<boolean>(false);

  const handleErrClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setErrMessage(null);
  };

  const handleSortFieldChange = (event: SyntheticEvent, value: SortField) => {
    setSortField(value);
  };
  const handleSortDescClick = () => {
    setSortDesc(!sortDesc);
  };

  const handleDeleteClick = (id: String) => {
    if (id) {
      deleteMission(id)
        .then((result: Mission) => {
          setAction(!action);
        }).catch((err) => {
          console.log(err);
        });
    }
  }

  useEffect(() => {
    getMissions(sortField, sortDesc)
      .then((result: MissionsResponse) => {
        setMissions(result.data.Missions);
      })
      .catch((err) => {
        setErrMessage("Failed to load missions.");
        console.log(err);
      });
  }, [sortField, sortDesc, action]);

  return (
    <AppLayout title="Missions">
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1">
          Solar Rocket Missions
        </Typography>

        <Toolbar disableGutters>
          <Grid justifyContent="flex-end" container>
            <IconButton>
              <FilterAltIcon />
            </IconButton>
            <ListMenu
              options={["Date", "Title", "Operator"]}
              endIcon={<SortIcon />}
              onSelectionChange={handleSortFieldChange}
            />
            <IconButton onClick={handleSortDescClick}>
              {sortDesc ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
            </IconButton>
          </Grid>
        </Toolbar>

        {missions ? (
          <Grid container spacing={2}>
            {" "}
            {missions.map((missions: Mission, key: number) => (
              <Grid item key={key}>
                <Card sx={{ width: 275, height: 200 }}>
                  <CardHeader
                    title={missions.title}
                    subheader={new Date(missions.launch.date).toDateString()}
                  />
                  <CardContent>
                    <Typography noWrap>{missions.operator}</Typography>
                  </CardContent>
                  <CardActions>
                    <MissionDialog setErrMessage={setErrMessage} id={missions.id} action={action} setAction={setAction} />
                    <Button onClick={e => handleDeleteClick(missions.id)}>Delete</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Box>
        )}

        <MissionDialog setErrMessage={setErrMessage} action={action} setAction={setAction} />

      </Container>
      <Snackbar
        open={errMessage != null}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleErrClose}
      >
        <Alert onClose={handleErrClose} variant="filled" severity="error">
          {errMessage}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
};

export { Missions };
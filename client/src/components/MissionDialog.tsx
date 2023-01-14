import { useEffect, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import ReactMarkdown from "react-markdown";
import {
    Button, Grid, Typography, Fab, Dialog, DialogTitle, TextField, DialogContent, DialogActions,
    Toolbar, Container, IconButton, Tooltip, Snackbar, Alert, Box, CircularProgress,
} from "@mui/material";
import React from "react";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
    Add as AddIcon, FilterAlt as FilterAltIcon, Sort as SortIcon, ArrowDownward as ArrowDownwardIcon, ArrowUpward as ArrowUpwardIcon,
} from "@mui/icons-material";
import { Mission } from "../graphql/schema";
import fetchGraphQL from "../graphql/GraphQL";

interface MissionResponse {
    data: {
        Mission: Mission;
    };
}

const editMission = async (
    id: String,
    title: String,
    operator: String,
    date: Date,
    vehicle: String,
    name: String,
    longitude: Number,
    latitude: Number,
    periapsis: Number,
    apoapsis: Number,
    inclination: Number,
    capacity: Number,
    available: Number
): Promise<Mission> => {
    return await fetchGraphQL(
        `mutation ($id:String! ,$title: String!, $operator: String!, $date: DateTime!, $vehicle: String!, $name: String!, $longitude: Float!, $latitude: Float!, $periapsis: Int!, $apoapsis: Int!, $inclination: Int!, $capacity: Int!, $available: Int!){
        editMission(id:$id ,mission: {
          title: $title,
          operator: $operator,
          launch:{
          date: $date,
          vehicle: $vehicle,
          location: {
            name: $name,
            longitude: $longitude,
            latitude: $latitude,
          },        
          },
          orbit:{
          periapsis: $periapsis,
          apoapsis: $apoapsis,
          inclination: $inclination,
          },
          payload:{
          capacity: $capacity,
          available: $available
          }
        }){
          id
          title
          operator
          launch {
          date
          }
        }
      }
      `,
        { id: id, title: title, operator: operator, date: date, vehicle: vehicle, name: name, longitude: longitude, latitude: latitude, periapsis: periapsis, apoapsis: apoapsis, inclination: inclination, capacity: capacity, available: available }
    );
};

const getMission = async (
    id: String
): Promise<MissionResponse> => {
    return await fetchGraphQL(
        `
        query($id:String!){
        Mission(id:$id) {
            id
            title
            operator
            launch {
              date
              vehicle
              location{
                name
                longitude
                latitude
              }
            }
              orbit{
                periapsis
                apoapsis
                inclination
                }
                payload{
                    capacity
                    available
                }
          }
    }
    `,
        { id: id }
    );
};

const createMission = async (
    title: String,
    operator: String,
    date: Date,
    vehicle: String,
    name: String,
    longitude: Number,
    latitude: Number,
    periapsis: Number,
    apoapsis: Number,
    inclination: Number,
    capacity: Number,
    available: Number
): Promise<Mission> => {
    return await fetchGraphQL(
        `mutation ($title: String!, $operator: String!, $date: DateTime!, $vehicle: String!, $name: String!, $longitude: Float!, $latitude: Float!, $periapsis: Int!, $apoapsis: Int!, $inclination: Int!, $capacity: Int!, $available: Int!){
        createMission(mission: {
          title: $title,
          operator: $operator,
          launch:{
          date: $date,
          vehicle: $vehicle,
          location: {
            name: $name,
            longitude: $longitude,
            latitude: $latitude,
          },        
          },
          orbit:{
          periapsis: $periapsis,
          apoapsis: $apoapsis,
          inclination: $inclination,
          },
          payload:{
          capacity: $capacity,
          available: $available
          }
        }){
          id
          title
          operator
          launch {
          date
          }
        }
      }
      `,
        { title: title, operator: operator, date: date?.toISOString(), vehicle: vehicle, name: name, longitude: longitude, latitude: latitude, periapsis: periapsis, apoapsis: apoapsis, inclination: inclination, capacity: capacity, available: available }
    );
};

type Props = {
    id?: String,
    setErrMessage: any,
    action: boolean,
    setAction: any,
};

const MissionDialog: React.FC<Props> = (props: Props): JSX.Element => {

    const [missionOpen, setMissionOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<String>("");
    const [operator, setOperator] = useState<String>("");
    const [tempLaunchDate, setTempLaunchDate] = useState<Date | null>(null);
    const [vehicle, setVehicle] = useState<String>("");
    const [name, setName] = useState<String>("");
    const [longitude, setLongitude] = useState<Number>(0);
    const [latitude, setLatitude] = useState<Number>(0);
    const [periapsis, setPeriapsis] = useState<Number>(0);
    const [apoapsis, setApoapsis] = useState<Number>(0);
    const [inclination, setInclination] = useState<Number>(0);
    const [capacity, setCapacity] = useState<Number>(0);
    const [available, setAvailable] = useState<Number>(0);

    const setAll = (mission: Mission) => {
        setTitle(mission.title);
        setOperator(mission.operator);
        setTempLaunchDate(mission.launch.date);
        setVehicle(mission.launch.vehicle);
        setName(mission.launch.location.name);
        setLongitude(mission.launch.location.longitude);
        setLatitude(mission.launch.location.latitude);
        setPeriapsis(mission.orbit.periapsis);
        setApoapsis(mission.orbit.apoapsis);
        setInclination(mission.orbit.inclination);
        setCapacity(mission.payload.capacity);
        setAvailable(mission.payload.available);
    }

    const handleMissionOpen = () => {
        if (props.id) {
            getMission(props.id).then((result: MissionResponse) => {
                setAll(result.data.Mission);
            }).catch((err) => {
                props.setErrMessage("Failed to get-mission.")
                console.log(err);
            })
        }
        setMissionOpen(true);
        setTempLaunchDate(null);
    };
    const handleMissionClose = () => {
        setMissionOpen(false);
    }
    const handleTempLaunchDateChange = (newValue: Date | null) => {
    };

    const handleSaveClick = () => {
        if (title && operator && tempLaunchDate && vehicle && name && longitude && latitude && periapsis && apoapsis && inclination && capacity && available) {
            if (props.id) {
                editMission(props.id, title, operator, tempLaunchDate, vehicle, name, longitude, latitude, periapsis, apoapsis, inclination, capacity, available)
                    .then((result: Mission) => {
                        props.setAction(!props.action);
                    }).catch((err) => {
                        props.setErrMessage("Failed to edit mission.")
                        console.log(err);
                    });
            }
            else {
                createMission(title, operator, tempLaunchDate, vehicle, name, longitude, latitude, periapsis, apoapsis, inclination, capacity, available)
                    .then((result: Mission) => {
                        props.setAction(!props.action);
                    }).catch((err) => {
                        props.setErrMessage("Failed to create mission.")
                        console.log(err);
                    });
            }
            setMissionOpen(false);
        }
        else {
            alert("no parameters");
        }
    }

    const checkValid = (newValue: Date | null) => {
        if (newValue?.getDate() === new Date().getDate()) {
            if (newValue?.getTime() < new Date().getTime()) {
                alert("The hour you selected has passed, please select a future time.");
                setTempLaunchDate(null);
            } else {
                setTempLaunchDate(newValue);
            }
        } else {
            setTempLaunchDate(newValue);
        }
    }

    return (
        <>
            {props.id ? (
                <Button onClick={handleMissionOpen}>Edit</Button>
            ) : (
                <Tooltip title="New Mission">
                    <Fab
                        sx={{ position: "fixed", bottom: 16, right: 16 }}
                        color="primary"
                        aria-label="add"
                        onClick={handleMissionOpen}
                    >
                        <AddIcon />
                    </Fab>
                </Tooltip>
            )}

            <Dialog
                open={missionOpen}
                onClose={handleMissionClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Mission</DialogTitle>
                <DialogContent>
                    <Grid container direction="column" spacing={2}>
                        <Grid item>
                            <TextField
                                autoFocus
                                id="title"
                                label="Title"
                                variant="standard"
                                fullWidth
                                type="text"
                                required
                                value={title}
                                onChange={(e) => (setTitle(e.target.value))}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                autoFocus
                                id="operator"
                                label="Operator"
                                variant="standard"
                                fullWidth
                                type="text"
                                required
                                value={operator}
                                onChange={(e) => (setOperator(e.target.value))}
                            />
                        </Grid>
                        <Grid item>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    minDate={new Date()}
                                    label="Launch Date"
                                    value={tempLaunchDate}
                                    onChange={handleTempLaunchDateChange}
                                    renderInput={(params) => (
                                        <TextField variant="standard" {...params} />
                                    )}
                                    onAccept={checkValid}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item>
                            <TextField
                                autoFocus
                                id="launch-vehicle"
                                label="Vehicle"
                                variant="standard"
                                fullWidth
                                type="text"
                                required
                                value={vehicle}
                                onChange={(e) => (setVehicle(e.target.value))}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                autoFocus
                                id="launch-location-name"
                                label="Name"
                                variant="standard"
                                fullWidth
                                type="text"
                                required
                                value={name}
                                onChange={(e) => (setName(e.target.value))}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                autoFocus
                                id="launch-location-longitude"
                                label="Longitude"
                                variant="standard"
                                fullWidth
                                type="number"
                                required
                                value={longitude}
                                onChange={(e) => (setLongitude(Number(e.target.value)))}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                autoFocus
                                id="launch-location-latitude"
                                label="Latitude"
                                variant="standard"
                                fullWidth
                                type="number"
                                required
                                value={latitude}
                                onChange={(e) => (setLatitude(Number(e.target.value)))}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                autoFocus
                                id="orbit-periapsis"
                                label="Periapsis"
                                variant="standard"
                                fullWidth
                                type="number"
                                required
                                value={periapsis}
                                onChange={(e) => (setPeriapsis(Number(e.target.value)))}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                autoFocus
                                id="orbit-apoapsis"
                                label="Apoapsis"
                                variant="standard"
                                fullWidth
                                type="number"
                                required
                                value={apoapsis}
                                onChange={(e) => (setApoapsis(Number(e.target.value)))}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                autoFocus
                                id="orbit-inclination"
                                label="Inclination"
                                variant="standard"
                                fullWidth
                                type="number"
                                required
                                value={inclination}
                                onChange={(e) => (setInclination(Number(e.target.value)))}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                autoFocus
                                id="payload-capacity"
                                label="Capacity"
                                variant="standard"
                                fullWidth
                                type="number"
                                required
                                value={capacity}
                                onChange={(e) => (setCapacity(Number(e.target.value)))}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                autoFocus
                                id="payload-available"
                                label="Available"
                                variant="standard"
                                fullWidth
                                type="number"
                                required
                                value={available}
                                onChange={(e) => (setAvailable(Number(e.target.value)))}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleMissionClose}>Cancel</Button>
                    <Button onClick={handleSaveClick}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export { MissionDialog };
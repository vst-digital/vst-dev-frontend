import React, { useState } from "react";
import { Button, Grid } from "@material-ui/core";
import "@reach/combobox/styles.css";
import "./styles/index.scss";

import { TextField } from "components";
import AddLocationIcon from "@mui/icons-material/AddLocation";

export function EnterCoords({ panTo }) {
  const [open, setOpen] = useState(false);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  return (
    <>
      <Grid container spacing={2}>
        {!open && (
          <Grid item xs={12}>
            <Button
              startIcon={<AddLocationIcon />}
              color="primary"
              variant="contained"
              onClick={() => {
                setOpen(true);
              }}
            >
              Enter Coordinates
            </Button>
          </Grid>
        )}
        {open && (
          <div>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  startIcon={<AddLocationIcon />}
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    setOpen(false);
                    const latitude = parseFloat(lat);
                    const longitude = parseFloat(lng);
                    try {
                      panTo({
                        lat: latitude,
                        lng: longitude,
                      });
                    } catch (error) {
                      console.log("Error: ", error);
                    }
                  }}
                >
                  Submit
                </Button>
              </Grid>{" "}
              <Grid item xs={12}>
                <TextField
                  type="number"
                  name="latitude"
                  placeholder="Enter Latitude"
                  value={lat}
                  onChange={(e) => {
                    setLat(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="number"
                  name="longitude"
                  placeholder="Enter Longitude"
                  value={lng}
                  onChange={(e) => {
                    setLng(e.target.value);
                  }}
                />
              </Grid>
            </Grid>
          </div>
        )}
      </Grid>
    </>
  );
}

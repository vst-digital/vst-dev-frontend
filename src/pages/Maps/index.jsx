import React, { useState, useEffect } from "react";
import { Button, Grid } from "@material-ui/core";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import "@reach/combobox/styles.css";
import "./styles/index.scss";

import { Container, TextField } from "components";
import AddLocationIcon from "@mui/icons-material/AddLocation";

const libraries = ["places"];
const mapContainerStyle = {
  height: "80vh",
  width: "85vw",
};

var center = {
  lat: 95.71,
  lng: -37.09,
};

export default function Maps() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCDlZooJWeMOgLNMftIw22hKK3gqnypb3Q",
    libraries,
  });
  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);

  const onMapClick = React.useCallback((e) => {
    console.log(e.latLng.lat());
    console.log(e.latLng.lng());
    setMarkers((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
      },
    ]);
    panTo({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // console.log(position.coords.latitude);
        // console.log(position.coords.longitude);
        center.lat = position.coords.latitude;
        center.lng = position.coords.longitude;
      },
      () => null
    );
  });
  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <EnterCoords panTo={panTo} />
        </Grid>
        <Grid item xs={12}>
          <Locate panTo={panTo} pr="20px" />
        </Grid>
        <Container>
          <Grid item xs={12}>
            <Search panTo={panTo} />
          </Grid>
          <Grid item xs={12}>
            <GoogleMap
              id="map"
              mapContainerStyle={mapContainerStyle}
              zoom={8}
              center={center}
              onClick={onMapClick}
              onLoad={onMapLoad}
            >
              {markers.map((marker) => (
                <Marker
                  key={`${marker.lat}-${marker.lng}`}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  onClick={() => {
                    setSelected(marker);
                  }}
                />
              ))}
            </GoogleMap>
          </Grid>
        </Container>
      </Grid>
    </>
  );
}

function Locate({ panTo }) {
  return (
    <Button
      startIcon={<AddLocationIcon />}
      color="primary"
      variant="contained"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position.coords.latitude);
            console.log(position.coords.longitude);
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      Current Location
    </Button>
  );
}
function EnterCoords({ panTo }) {
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
        )}
      </Grid>
    </>
  );
}

function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => center.lat, lng: () => center.lng },
      radius: 100 * 1000,
    },
  });

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      console.log(lat);
      console.log(lng);
      panTo({ lat, lng });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <div className="search">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search your location"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}

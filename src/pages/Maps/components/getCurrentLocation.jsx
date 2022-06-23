import { Button } from "@material-ui/core";
import AddLocationIcon from "@mui/icons-material/AddLocation";

export function Locate() {
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
          },
          () => null
        );
      }}
    >
      Current Location
    </Button>
  );
}

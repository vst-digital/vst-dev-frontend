import { Button, Card, CardContent, Grid, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useStyles } from "./CardStyle";

const CardComp = (props) => {
  const { title, IconComp, path, id } = props;

  const classes = useStyles();
  const history = useHistory();
  return (
    <Card id={id} className={classes?.root} onClick={() => history.push(path)}>
      <CardContent>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography
              className={classes?.title}
              variant="h3"
              color="textSecondary"
              gutterBottom
            >
              {title}
            </Typography>
          </Grid>
          <Grid item>{IconComp()}</Grid>
        </Grid>
        <div className={classes?.difference}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => history.push(path)}
          >
            {title}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardComp;

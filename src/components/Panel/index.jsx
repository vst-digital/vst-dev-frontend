import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Divider from "@material-ui/core/Divider";

import {Section} from "components";

const Panel = ({title, heading = 'h5', elevation = 2, actions, panelActions, contentStyle, ...rest}) => {

    return (
        <Card elevation={elevation}>
            {(title || actions) && <Section title={title} heading={heading}>{actions}</Section>}

            <CardContent style={contentStyle}>{rest.children}</CardContent>

            {panelActions && <>
                <Divider/>
                <CardActions style={{justifyContent: 'flex-end'}}>
                    {panelActions}
                </CardActions>
            </>}
        </Card>
    );
};

export default Panel;

import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";


export default function Sample() {
const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[3],
      fontSize: 15
    }
  }))(Tooltip);

  return (
    <div>
      <LightTooltip title="A long message that can be use to show a message to indicate the error that has occurred, This is a demo message!">
        <Button>Light</Button>
      </LightTooltip>
    </div>
  );
}

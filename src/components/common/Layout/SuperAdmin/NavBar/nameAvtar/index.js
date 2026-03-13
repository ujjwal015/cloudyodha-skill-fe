import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { deepPurple } from "@mui/material/colors";
import { getNameAvatar } from "../../../../../../utils/projectHelper";

export default function NameAvatars({
  firstName = "",
  lastName = "",
  handleClick,
}) {
  const avatarLetter = getNameAvatar(firstName, lastName);

  return (
    <Stack direction="row" spacing={2} onClick={handleClick}>
      <Avatar sx={{ bgcolor: deepPurple[500], cursor: "pointer" }}>
        {avatarLetter && avatarLetter}
      </Avatar>
    </Stack>
  );
}

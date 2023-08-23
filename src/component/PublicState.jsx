import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import UserService from "../services/user.service";

export default function PublicState({song}) {
    const handleChangeState = (event) => {
        const accessToken = localStorage.getItem("token");

        UserService.updateSongState({songId: song._id, isPublic: event.target.value}, accessToken)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <Box sx={{minWidth: 120}}>
            <FormControl fullWidth>
                <Select
                    defaultValue={song.isPublic ? 1 : 0}
                    onChange={handleChangeState}
                    sx={{
                        backgroundColor: 'black',
                        color: 'white',
                        '& svg': {
                            color: 'white',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'black',
                        },
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                backgroundColor: 'grey',
                                color: 'white',
                            },
                        },
                    }}
                >
                    <style>
                        {`
                            .Mui-selected {
                                background-color: #4773ba !important;
                            }
                        `}
                    </style>
                    <MenuItem value={0}>
                        <LockIcon
                            sx={{
                                fontSize: 'medium',
                            }}
                        />
                        &nbsp;Private
                    </MenuItem>
                    <MenuItem value={1}>
                        <PublicIcon
                            sx={{
                                fontSize: 'medium',
                            }}
                        />
                        &nbsp;Public
                    </MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}
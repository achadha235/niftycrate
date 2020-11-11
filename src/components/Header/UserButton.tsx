import { useRef, useState, useEffect } from 'react';
import {
  Button,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  Avatar,
  Typography,
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToAppTwoTone';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import shortAddress from 'src/utils/shortAddress';
import UserAvatar from '../UserAvatar';

export interface UserButtonProps {
  className: string;
  onLogoutClicked: React.MouseEventHandler;
  user: {
    balance: string;
    address: string;
    // imageUrl: string;
  };
}

export function UserButton(props: UserButtonProps) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Button
        className={props.className}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup='true'
        onClick={handleToggle}
      >
        <Avatar className='h-8 w-8 mr-2'>
          <UserAvatar user={props.user.address} />
        </Avatar>
        Ξ{' '}
        <Typography className='font-mono font-bold'>
          {props.user.balance}
        </Typography>
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper className='w-48'>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id='menu-list-grow'
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem>
                    <Typography variant='body2' className='font-mono font-bold'>
                      {props.user.address}
                    </Typography>
                  </MenuItem>

                  <MenuItem
                    onClick={(event) => {
                      props.onLogoutClicked(event);
                      handleClose(event);
                    }}
                  >
                    <ExitToAppIcon className='mr-1' /> Logout
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    paper: {
      marginRight: theme.spacing(2),
    },
  })
);

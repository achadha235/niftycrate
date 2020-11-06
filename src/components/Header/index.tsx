import { AppBar, Button, Toolbar } from '@material-ui/core';
import { UserButton } from './UserButton';
import StorefrontIcon from '@material-ui/icons/StorefrontTwoTone';
import AllOutIcon from '@material-ui/icons/AllOutTwoTone';
import InfoIcon from '@material-ui/icons/InfoTwoTone';
import AppsIcon from '@material-ui/icons/AppsTwoTone';
import PersonIcon from '@material-ui/icons/PersonTwoTone';

export interface HeaderProps {
  user?: {
    address: string;
    imageUrl: string;
  };
  onStoreClicked: React.MouseEventHandler;
  onAllCratesClicked: React.MouseEventHandler;
  onMyCratesClicked: React.MouseEventHandler;
  onHowItWorksClicked: React.MouseEventHandler;
  onLoginClicked: React.MouseEventHandler;
  onLogoutClicked: React.MouseEventHandler;
}

function Header(props: HeaderProps) {
  return (
    <AppBar className='appBar'>
      <Toolbar variant='dense'>
        <span className='uppercase text-sm font-medium tracking-widest cursor-pointer flex flex-row justify-center items-center'>
          <img className='h-6 mr-2 logo' src='/images/logo.svg' />
          <b>Nifty</b>Crates
        </span>

        {/* Store */}
        <Button
          onClick={props.onStoreClicked}
          variant='text'
          className='ml-8'
          color='inherit'
          startIcon={<StorefrontIcon />}
        >
          Store
        </Button>

        {/* All crates */}
        <Button
          onClick={props.onAllCratesClicked}
          variant='text'
          className='ml-8'
          color='inherit'
          startIcon={<AllOutIcon />}
        >
          All Crates
        </Button>

        {/* Crates */}
        <Button
          onClick={props.onMyCratesClicked}
          variant='text'
          className='ml-8'
          color='inherit'
          startIcon={<AppsIcon />}
        >
          My Crates
        </Button>

        {/* FAQ */}
        <Button
          onClick={props.onHowItWorksClicked}
          variant='text'
          className='ml-8'
          color='inherit'
          startIcon={<InfoIcon />}
        >
          How it Works
        </Button>

        {/* User */}
        {props.user ? (
          <UserButton
            onLogoutClicked={props.onLogoutClicked}
            user={props.user}
            className='ml-auto'
          />
        ) : (
          <Button
            onClick={props.onLoginClicked}
            variant='text'
            className='ml-auto'
            color='inherit'
            startIcon={<PersonIcon />}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;

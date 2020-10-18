import Contract from 'src/components/Contract';
import drizzleLoading from 'src/utils/drizzleLoading';
import { drizzleConnect } from '@drizzle/react-plugin';
import NiftyCrate from 'src/artifacts/NiftyCrate.json';

function NiftyCratePage({ drizzleState }) {
  if (drizzleLoading(drizzleState)) {
    return <div> Loading</div>;
  }
  console.log(drizzleState);
  return (
    <div>
      Hey <Contract drizzleState={drizzleState} artifact={NiftyCrate} />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    drizzleState: state,
  };
};

export default drizzleConnect(NiftyCratePage, mapStateToProps);

import {
  AccountData,
  ContractData,
  ContractForm,
} from '@drizzle/react-components';

function Contract({ artifact, drizzleState }) {
  const name = artifact.contractName;
  const address = artifact.networks[drizzleState.web3.networkId].address;
  const abi = artifact.abi;
  const views = abi.filter((method) => method.stateMutability === 'view');
  return (
    <div>
      {name} - {address}
      {views.map((method) => (
        <div>
          <p>{method.name}</p>
          <ContractForm contract={name} method={method.name} />
        </div>
      ))}
    </div>
  );
}

export default Contract;

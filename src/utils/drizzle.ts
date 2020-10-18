import { drizzleReactHooks } from '@drizzle/react-plugin';
import { newContextComponents } from '@drizzle/react-components';

export const { useDrizzleState, useDrizzle } = drizzleReactHooks;
export const { AccountData, ContractForm, ContractData } = newContextComponents;

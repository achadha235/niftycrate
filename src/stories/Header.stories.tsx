import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import Header, { HeaderProps } from 'src/components/Header';
import getUserImage from 'src/utils/getUserImage';

export default {
  title: 'Header',
  component: Header,
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as Meta;

const Template: Story = (args: HeaderProps) => <Header {...args} />;

// const token = mockToken[0];

export const LoggedIn = Template.bind({});

const address = '0x24325354ABCDEF234';
const imageUrl = getUserImage(address);
LoggedIn.args = {
  user: {
    address,
    balance: '0.235',
    imageUrl,
  },
};

export const LoggedOut = Template.bind({});

LoggedOut.args = {};

// export const Loading = Template.bind({});
// const loadingArgs: CrateCardProps = {
//   loading: true,
// };
// Loading.args = loadingArgs;

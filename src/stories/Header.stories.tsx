import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import Header, { HeaderProps } from 'src/components/Header';

export default {
  title: 'Header',
  component: Header,
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as Meta;

const Template: Story = (args: HeaderProps) => <Header {...args} />;

// const token = mockToken[0];

export const LoggedIn = Template.bind({});

LoggedIn.args = {
  user: {
    address: '0x24325354ABCDEF234',
    imageUrl: 'https://placehold.it/40x40',
  },
};

export const LoggedOut = Template.bind({});

LoggedOut.args = {};

// export const Loading = Template.bind({});
// const loadingArgs: CrateCardProps = {
//   loading: true,
// };
// Loading.args = loadingArgs;

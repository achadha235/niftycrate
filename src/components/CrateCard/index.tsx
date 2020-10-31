import { Badge, Fade, Paper } from '@material-ui/core';

interface CrateCardProps {
  image: string;
  id: number;
  collection: {
    name: string;
    image: string;
  };
  numberOfSales: number;
}

export default function CrateCard(props: CrateCardProps) {
  return (
    <Paper>
      <div className='bg-green-400'>
        <h1>H1</h1>
      </div>
    </Paper>
  );
}

import {
  Button,
  Paper,
  Typography,
  Modal,
  Fade,
  Checkbox,
  TextField,
} from '@material-ui/core';

export default function TokenCollection({ tokens }) {
  return (
    <>
      {tokens.map(
        ({
          image_url,
          image_preview_url,
          image_thumbnail_url,
          background_color,
          collection,
          id,
          last_sale,
        }) => {
          return (
            <TokenCollectionCard
              image_url={image_url}
              image_preview_url={image_preview_url}
              image_thumbnail_url={image_thumbnail_url}
              background_color={background_color}
              collection={collection}
              id={id}
              last_sale={last_sale}
            />
          );
        }
      )}
    </>
  );
}

export function TokenCollectionCard({
  image_url,
  image_preview_url,
  image_thumbnail_url,
  background_color,
  collection,
  id,
  last_sale,
}) {
  return (
    <Paper className='p-2 mb-2 '>
      <div className='flex flex-row'>
        <img
          className='flex-1/3'
          src={image_preview_url}
          style={{
            height: 80,
            width: 80,
            borderRadius: 5,
            background: background_color ? `#${background_color}` : 'white',
          }}
        />
        <div className='flex-2/3 pl-3'>
          <Typography className='text-xs'>{collection.name}</Typography>
          <Typography variant='body1'>#{id}</Typography>
        </div>
      </div>
    </Paper>
  );
}

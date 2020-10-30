// Hello.fixture.jsx
import Crate from './index';

export default (
  <Crate
    tokens={[
      { image_original_url: 'https://placehold.it/500x500?text=1' },
      { image_original_url: 'https://placehold.it/500x500?text=2' },
      { image_original_url: 'https://placehold.it/500x500?text=3' },
      { image_original_url: 'https://placehold.it/500x500?text=4' },
      { image_original_url: 'https://placehold.it/500x500?text=5' },
      { image_original_url: 'https://placehold.it/500x500?text=6' },
    ]}
  />
);

// Okay, alternative found.
// @ReactCosmos
//  works way better! No unnecessary unbundling of core features or overly opinionated defaults. Just what I wanted!

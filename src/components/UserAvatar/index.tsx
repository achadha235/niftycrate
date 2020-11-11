import Avatar from 'avataaars';
import options from './options';

export interface UserAvatarProps {
  user: string;
}

function xmur3(str) {
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
    (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)),
      (h = (h << 13) | (h >>> 19));
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

export default function UserAvatar(props: UserAvatarProps) {
  const vals = {};
  const seed = xmur3(props.user);
  for (var i = 0; i < options.length; i++) {
    vals[options[i].name] =
      options[i].options[seed() % options[i].options.length];
  }
  return <Avatar {...(vals as any)} />;
}

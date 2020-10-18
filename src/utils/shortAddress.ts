function shortAddress(addr) {
  return addr && `${addr.slice(0, 5)}...${addr.slice(addr.length - 3)}`;
}

export default shortAddress;

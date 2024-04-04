export const SOCKS_VERSION = 5;

export const AUTH_METHODS = {
  0: '00', // NO AUTHENTICATION REQUIRED
  1: '01', // GSSAPI
  2: '02', // USERNAME/PASSWORD
  3: '03', // to X'7F' IANA ASSIGNED
  80: '80', // to X'FE' RESERVED FOR PRIVATE METHODS
  255: 'FF', // NO ACCEPTABLE METHODS
}

export const SOCKS_CMD = {
  CONNECT: 1,
  BIND: 2,
  UDP_ASSOCIATE: 3,
};

export const ADDRESS_TYPE = {
  IPV4: 1,
  DOMAINNAME: 3,
  IPV6: 4,
};
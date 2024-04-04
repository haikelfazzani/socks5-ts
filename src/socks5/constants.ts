/**
 * +----+-----+-------+------+----------+----------+
  |VER | REP |  RSV  | ATYP | BND.ADDR | BND.PORT |
  +----+-----+-------+------+----------+----------+
  | 1  |  1  | X'00' |  1   | Variable |    2     |
  +----+-----+-------+------+----------+----------+

DST.ADDR (Destination Address): Variable length depending on ATYP:
  For ATYP of 0x01 (IP v4): 4 bytes representing the IP address.
  For ATYP of 0x03 (Domain name): 1 byte length followed by the domain name string.
  For ATYP of 0x04 (IP v6): 16 bytes representing the IP v6 address.
 */

export const SOCKS_VERSION = 5;

export const AUTH_METHODS = {
  0x00: 'NO AUTHENTICATION REQUIRED',
  0x01: 'GSSAPI',
  0x02: 'USERNAME/PASSWORD',
  0x7f: 'IANA ASSIGNED',
  0xfe: 'RESERVED FOR PRIVATE METHODS',
  0xff: 'NO ACCEPTABLE METHODS'
}

export const COMMANDS = {
  1: 'CONNECT',
  2: 'BIND',
  3: 'UDP_ASSOCIATE',
};

export const ADDRESS_TYPE = {
  1: 'IPV4',
  3: 'DOMAIN_NAME',
  4: 'IPV6',
};

export const CODE_REPLY = {
  0: 'succeeded',
  1: 'general SOCKS server failure',
  2: 'connection not allowed by ruleset',
  3: 'Network unreachable',
  4: 'Host unreachable',
  5: 'Connection refused',
  6: 'TTL expired',
  7: 'Command not supported',
  8: 'Address type not supported',
  9: 'to X\'FF\' unassigned',
}
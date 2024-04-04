function hostname(buf) {
  let hostName = ''
  if (buf.length === 4) {
    for (let i = 0; i < buf.length; ++i) {
      hostName += parseInt(buf[i], 10);
      if (i != 3) hostName += '.'
    }
  }
  else if (buf.length === 16) {
    for (let i = 0; i < 16; i += 2) {
      let part = buf.slice(i, i + 2).readUInt16BE(0).toString(16)
      hostName += part
      if (i != 14) hostName += ':'
    }
  }
  return hostName
}

function domainVerify(host) {
  let regex = new RegExp(/^([a-zA-Z0-9|\-|_]+\.)?[a-zA-Z0-9|\-|_]+\.[a-zA-Z0-9|\-|_]+(\.[a-zA-Z0-9|\-|_]+)*$/)
  return regex.test(host)
}

export {
  hostname,
  domainVerify
}
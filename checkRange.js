function ipToBinary(ipAddress) {
  return ipAddress
    .split(".")
    .map(Number)
    .map((num) => ("00000000" + num.toString(2)).slice(-8))
    .join("");
}

function compareBits(ipBinary, cidrBinary) {
  for (let i = 0; i < cidrBinary.length; i++) {
    if (cidrBinary[i] === "1" && ipBinary[i] !== "1") {
      return false;
    }
  }
  return true;
}

function ipInCIDR(ip, cidr) {
  if (!ip || !cidr) {
    throw new Error("Invalid IP address");
  }
  const [range, mask] = cidr.split("/");
  if (parseInt(mask) > 32 || parseInt(mask) < 0) {
    throw new Error(
      `Invalid CIRD, Current mask is ${mask} not in valid range [0,32]`
    );
  }

  const ipBinary = ipToBinary(ip);
  const rangeBinary = ipToBinary(range);
  const cidrBinary = rangeBinary.slice(0, mask);

  return compareBits(ipBinary, cidrBinary);
}

// Test the function
// const ip = "192.168.1.10";
// const cidr = "192.168.1.0/24";
// console.log("BINARY IP   : " + ipToBinary(ip));
// console.log("BINARY CIDR : " + ipToBinary("255.255.255.255"));

// console.log(ipInCIDR(ip, "")); // Output: true, because 192.168.1.10 is within the range 192.168.1.0/24

// // Another test
// const ip2 = "10.20.30.40";
// const cidr2 = "10.20.30.0/234";
// console.log(ipInCIDR(ip2, cidr2)); // Output: true, because 10.20.30.40 is within the range 10.20.30.0/24

// // Test outside of range
// const ip3 = "192.168.2.10";
// console.log(ipInCIDR(ip3, cidr));

// ("150.249.192.115, 70.132.40.139");

// ("150.249.192.115/12, 70.132.40.139/12");

export function convertRawStrToArrayIp(rawStr) {
  if (!rawStr) {
    throw new Error("Invalid raw ip string");
  }
  return rawStr.split(",");
}

export function isGrantedClient(clientReqIPs, WhiteListCIDR) {
  let results = false;
  clientReqIPs.forEach((clientIp) => {
    WhiteListCIDR.forEach((cidr) => {
      if (ipInCIDR(clientIp, cidr)) {
        return (results = true);
      }
    });
  });
  return results;
}

// const clientRawIp = convertRawStrToArrayIp("150.249.192.115,70.132.40.139");
// const rawCidr = convertRawStrToArrayIp("150.249.192.11/32,192.168.1.0/21");
// console.log(isGrantedClient(clientRawIp,rawCidr))

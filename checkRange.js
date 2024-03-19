var ipRangeCheck = require("ip-range-check");

// function ipToBinary(ipAddress) {
//   ipAddress = ipAddress.split(".");
//   if (ipAddress.length > 4) {
//     throw new Error("Invalid IPv4 address, Ipv4 must be 32bit");
//   }
//   ipAddress = ipAddress.map((num) => {
//     num = Number(num);
//     if (num < 0 || num > 255) {
//       throw new Error("Invalid IPv4 address");
//     }
//     return num;
//   });
//   ipAddress = ipAddress
//     .map((num) => ("00000000" + num.toString(2)).slice(-8))
//     .join("");
//   return ipAddress;
// }

// function compareBits(ipBinary, cidrBinary) {
//   for (let i = 0; i < cidrBinary.length; i++) {
//     if (cidrBinary[i] === "1" && ipBinary[i] !== "1") {
//       return false;
//     }
//   }
//   return true;
// }

// function ipInCIDR(ip, cidr) {
//   if (!ip || !cidr) {
//     throw new Error("Invalid IP address");
//   }
//   const [range, mask] = cidr.split("/");
//   if (parseInt(mask) > 32 || parseInt(mask) < 0) {
//     throw new Error(
//       `Invalid CIRD, Current mask is ${mask} not in valid range [0,32]`
//     );
//   }

//   const ipBinary = ipToBinary(ip);
//   const rangeBinary = ipToBinary(range);
//   const cidrBinary = rangeBinary.slice(0, mask);

//   return compareBits(ipBinary, cidrBinary);
// }

// // Test the function
// const ip = "253.168.1.102";
// const cidr = "192.168.1.0/24";
// console.log("BINARY IP   : " + ipToBinary(ip));
// console.log("BINARY CIDR : " + ipToBinary('192.168.1.0'));
// console.log(ipInCIDR(ip, cidr));



// console.log(ipRangeCheck('12723.10.0.1','127.0.0.1/24'))

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
  console.log(rawStr);
  return rawStr.split(",");
}

export function isGrantedClient(clientReqIPsRaw, whiteListCIDRsRaw) {
  let clientReqIPs= convertRawStrToArrayIp(clientReqIPsRaw)
  let whiteListCIDR= convertRawStrToArrayIp(whiteListCIDRsRaw)
  // validate CIDR
  whiteListCIDR = whiteListCIDR.map(cidr => {
    if(!isValidCIDR(cidr)){
      console.log("Invalid CIDR >>>>>>>>>>>>>>>>>>" + cidr);
    }
    return cidr;
  })
  let results = false;
  clientReqIPs.forEach((clientIp) => {
    if(ipRangeCheck(clientIp, whiteListCIDR)){
      results = true;
    }
  });
  return results;
}

// const clientRawIp = convertRawStrToArrayIp("150.249.192.115,70.132.40.139");
// const rawCidr = convertRawStrToArrayIp("150.249.192.11/32,192.168.1.0/21");
// console.log(isGrantedClient(clientRawIp,rawCidr))




function isValidCIDR(cidr) {
  // Regular expression for CIDR notation
  const cidrRegex = /^((?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/(3[0-2]|[1-2]?[0-9]))$/;

  // Test if the string matches the CIDR regex
  if (!cidrRegex.test(cidr)) {
    return false; // Not a valid format
  }

  // Check the CIDR range
  const parts = cidr.split('/');
  const ip = parts[0]; // IP part
  const subnet = parseInt(parts[1], 10); // Subnet part

  // Validate IP part
  const ipParts = ip.split('.');
  for (let i = 0; i < 4; i++) {
    const ipPart = parseInt(ipParts[i], 10);
    if (ipPart < 0 || ipPart > 255 || isNaN(ipPart)) {
      return false; // IP part is not a number between 0 and 255
    }
  }

  // Validate subnet range
  if (subnet < 0 || subnet > 32 || isNaN(subnet)) {
    return false; // Subnet is not a number between 0 and 32
  }

  return true; // Passed all checks
}


// Test the function
// console.log(isValidIPv4('192.168.1.1')); // true
// console.log(isValidIPv4('0.0.0.0')); // true
// console.log(isValidIPv4('255.255.255.255')); // true
// console.log(isValidIPv4('256.256.256.256')); // false (out of range)
// console.log(isValidIPv4('192.168.1')); // false (not enough parts)
// console.log(isValidIPv4('192.168.1.abc')); // 

// console.log(isValidCIDR('192.168.1.1/24')); // true
// console.log(isValidCIDR('10.0.0.0/8')); // true
// console.log(isValidCIDR('192.168.1.1/33')); // false (subnet range exceeded)
// console.log(isValidCIDR('192.168.1.abc/24')); // false (non-numeric characters)
// console.log(isValidCIDR('192.168.1.1')); 
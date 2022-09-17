// Adapted to Node: https://www.haxball.com/webrtcdiagnostics

/*
docker run --name nat-test --rm -v $PWD:/home/hax -it node /bin/sh

cd /home/hax
npm i -g node-pre-gyp
npm i net wrtc ws xmlhttprequest

node nat-test.js
*/

window = global;
location = { protocol: 'http' };
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

net = require('net');
wrtc = require('wrtc');

RTCPeerConnection = wrtc.RTCPeerConnection;
RTCSessionDescription = wrtc.RTCSessionDescription;
RTCIceCandidate = wrtc.RTCIceCandidate;

WebSocket = require('ws');

function logCandidate(candidate) {
  console.log(candidate);
}

function setResult(id, value) {
  console.log(id, value ? "YES" : "NO");
}

// parseCandidate from https://github.com/fippo/sdp
function parseCandidate(line) {
  var parts;
  // Parse both variants.
  if (line.indexOf('a=candidate:') === 0) {
    parts = line.substring(12).split(' ');
  } else {
    parts = line.substring(10).split(' ');
  }

  var candidate = {
    foundation: parts[0],
    component: parts[1],
    protocol: parts[2].toLowerCase(),
    priority: parseInt(parts[3], 10),
    ip: parts[4],
    port: parseInt(parts[5], 10),
    // skip parts[6] == 'typ'
    type: parts[7]
  };

  for (var i = 8; i < parts.length; i += 2) {
    switch (parts[i]) {
    case 'raddr':
      candidate.relatedAddress = parts[i + 1];
      break;
    case 'rport':
      candidate.relatedPort = parseInt(parts[i + 1], 10);
      break;
    case 'tcptype':
      candidate.tcpType = parts[i + 1];
      break;
    default: // Unknown extensions are silently ignored.
      break;
    }
  }
  return candidate;
};

var candidates = [];

function analizeCandidates( candidates ) {
  var hasHostCandidate = false;
  var hasMultiplePortsForRelatedPort = false;
  var hasSrflxCandidate = false;

  for ( let candidate of candidates ) {
    if ( candidate.protocol != "udp" ) continue; // Ignore non udp candidates.

    if ( candidate.type == "host" ) {
      hasHostCandidate = true;
    } else if ( candidate.type == "srflx" ) {
      hasSrflxCandidate = true;
      let relatedPort = candidate.relatedPort;
      let port = candidate.port;
      if ( candidates.find( (c) => { return c.relatedPort == relatedPort &&  c.port != port } ) ) {
        hasMultiplePortsForRelatedPort = true;
      }
    }
  }

  setResult("hostcand", hasHostCandidate);
  setResult("srflxcand", hasSrflxCandidate);
  setResult("symmetric", hasMultiplePortsForRelatedPort);
}

var pc = new RTCPeerConnection({iceServers: [
  {urls: 'stun:stun1.l.google.com:19302'},
  {urls: 'stun:stun2.l.google.com:19302'}
]});

pc.createDataChannel("foo");

pc.onicecandidate = function(e) {
  var candidate = e.candidate;
  if ( candidate != null ) {
    try {
      candidate = parseCandidate(candidate.candidate);
      logCandidate(JSON.stringify(candidate));
      candidates.push(candidate);
    } catch (e) {}
  } else {
    analizeCandidates(candidates);
  }
}

pc.createOffer().then(offer => pc.setLocalDescription(offer));

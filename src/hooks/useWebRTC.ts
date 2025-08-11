import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

const useWebRTC = (roomId: string, stream: MediaStream | undefined) => {
  const [peers, setPeers] = useState<Peer.Instance[]>([]);
  const socketRef = useRef<any>();
  const peersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!stream) return;
    socketRef.current = io.connect('http://localhost:8000');
    socketRef.current.emit('join room', roomId);
    socketRef.current.on('other users', (users: any) => {
      const peers: Peer.Instance[] = [];
      users.forEach((userID: any) => {
        const peer = createPeer(userID, socketRef.current.id, stream);
        peersRef.current.push({
          peerID: userID,
          peer,
        });
        peers.push(peer);
      });
      setPeers(peers);
    });

    socketRef.current.on("offer", (payload: any) => {
      const peer = addPeer(payload.signal, payload.caller, stream);
      peersRef.current.push({
        peerID: payload.caller,
        peer,
      });
      setPeers(users => [...users, peer]);
    });

    socketRef.current.on("answer", (payload: any) => {
      const item = peersRef.current.find(p => p.peerID === payload.caller);
      item.peer.signal(payload.signal);
    });

    socketRef.current.on('user-disconnected', (id: any) => {
      const peerObj = peersRef.current.find(p => p.peerID === id);
      if(peerObj) {
        peerObj.peer.destroy();
      }
      const newPeers = peersRef.current.filter(p => p.peerID !== id);
      peersRef.current = newPeers;
      setPeers(newPeers.map(p => p.peer));
    });

    return () => {
      socketRef.current.disconnect();
      peers.forEach(peer => peer.destroy());
    }
  }, [roomId, stream]);

  function createPeer(userToSignal: any, callerID: any, stream: MediaStream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', signal => {
      socketRef.current.emit('offer', {
        target: userToSignal,
        caller: callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal: any, callerID: any, stream: MediaStream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', signal => {
      socketRef.current.emit('answer', { target: callerID, signal });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
    }
  };

  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
    }
  };

  return { peers, toggleMute, toggleCamera };
};

export default useWebRTC;

import type { Server as SocketServer } from "socket.io";

export function registerSocketHandlers(io: SocketServer) {
  io.on("connection", (socket) => {
    const orderId = String(socket.handshake.query.orderId ?? "");
    if (orderId) socket.join(`order:${orderId}`);

    socket.on("subscribe-order", (id: string) => {
      socket.join(`order:${id}`);
    });

    socket.on("dispatch", (p: { orderId: string; lat: number; lng: number }) => {
      io.to(`order:${p.orderId}`).emit("location", { lat: p.lat, lng: p.lng });
    });
  });
}

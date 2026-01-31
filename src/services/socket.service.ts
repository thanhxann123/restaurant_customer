import { Client } from "@stomp/stompjs";
import type { Message } from "@stomp/stompjs";
// @ts-expect-error: sockjs-client does not have bundled types, install @types/sockjs-client if needed
import SockJS from "sockjs-client";

// URL socket của backend (Thường là root + /ws, không qua /api)
const SOCKET_URL = "//restaurantcustomer-production.up.railway.app/ws";

class SocketService {
  private client: Client;
  private connected: boolean = false;

  constructor() {
    this.client = new Client({
      // Sử dụng SockJS để tương thích tốt hơn các trình duyệt cũ
      webSocketFactory: () => new SockJS(SOCKET_URL),

      // Cấu hình tự động kết nối lại
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      // debug: (str) => console.log(str), // Bật dòng này để xem log chi tiết khi dev
    });

    this.client.onConnect = () => {
      this.connected = true;
      console.log("✅ Connected to WebSocket");
    };

    this.client.onDisconnect = () => {
      this.connected = false;
      console.log("❌ Disconnected from WebSocket");
    };

    this.client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };
  }

  /**
   * Mở kết nối socket
   * @param onConnectCallback Hàm chạy sau khi kết nối thành công
   */
  connect(onConnectCallback?: () => void) {
    // Nếu đã kết nối rồi thì chạy luôn callback
    if (this.client.active && this.connected) {
      if (onConnectCallback) onConnectCallback();
      return;
    }

    // Nếu đang kết nối dở hoặc chưa kết nối
    if (onConnectCallback) {
      // Hook vào sự kiện onConnect của thư viện
      const originalOnConnect = this.client.onConnect;
      this.client.onConnect = (frame) => {
        originalOnConnect(frame); // Chạy logic gốc (set connected = true)
        onConnectCallback(); // Chạy logic của user (subscribe...)
      };
    }

    this.client.activate();
  }

  /**
   * Ngắt kết nối
   */
  disconnect() {
    if (this.client.active) {
      this.client.deactivate();
      this.connected = false;
    }
  }

  /**
   * Đăng ký lắng nghe một topic cụ thể
   * @param topic Đường dẫn topic (vd: /topic/table/1)
   * @param callback Hàm xử lý khi có message mới
   */
  subscribe<T = unknown>(topic: string, callback: (data: T) => void) {
    // Nếu chưa kết nối, thử kết nối trước rồi mới subscribe
    if (!this.client.active || !this.connected) {
      console.warn("Socket not connected. Connecting first...");
      this.connect(() => {
        this.doSubscribe<T>(topic, callback);
      });
      return;
    }

    return this.doSubscribe<T>(topic, callback);
  }

  // Hàm private thực hiện subscribe thực tế
  private doSubscribe<T>(topic: string, callback: (data: T) => void) {
    console.log(`Subscribing to ${topic}...`);
    return this.client.subscribe(topic, (message: Message) => {
      try {
        if (message.body) {
          const data = JSON.parse(message.body) as T;
          callback(data);
        }
      } catch (e) {
        console.error("Error parsing socket message", e);
      }
    });
  }
}

// Export một instance duy nhất (Singleton) để dùng toàn app
export const socketService = new SocketService();

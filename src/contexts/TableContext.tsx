import React, { useEffect, useState, useCallback } from 'react';
import { socketService } from '../services/socket.service';
import { tableService } from '../services/table.service';
import { toast } from 'sonner';
import { TableContext } from './definitions'; 

interface SocketMessage {
  type: 'TABLE_OPENED' | 'TABLE_CHANGED' | 'PAYMENT_CONFIRMED' | 'ORDER_UPDATE' | 'TRANSFER_SUCCESS' | 'MENU_STATUS_CHANGED' | string;
  token?: string;
  tableId?: number;
  newTableId?: number;
  newTableName?: string;
  newTableToken?: string;
  qrCodeUrl?: string;
  status?: string;
  menuId?: number;
}

export function TableProvider({ children }: { children: React.ReactNode }) {
  const [tableId, setTableId] = useState<number | null>(() => {
    const saved = localStorage.getItem('current-table-id');
    return saved ? parseInt(saved) : null;
  });

  const [tableName, setTableName] = useState<string | null>(null);
  const [isWaitingForStaff, setIsWaitingForStaff] = useState(false);
  const [isTableOpened, setIsTableOpened] = useState(() => !!localStorage.getItem('table-session-token'));
  
  const [paymentQrCode, setPaymentQrCode] = useState<string | null>(null);
  const [lastOrderUpdate, setLastOrderUpdate] = useState<number>(0);
  const [lastMenuUpdate, setLastMenuUpdate] = useState<number>(0); // State mới

  const handleSocketMessage = useCallback((message: SocketMessage) => {
    console.log("📩 Socket received:", message);
    
    switch (message.type) {
      case 'TABLE_OPENED':
        if (message.token) {
          localStorage.setItem('table-session-token', message.token);
          setIsWaitingForStaff(false);
          setIsTableOpened(true);
          toast.success("Bàn đã được mở! Chúc quý khách ngon miệng.");
        }
        break;

      case 'TABLE_CHANGED':
        if (message.newTableId && message.newTableToken) {
          localStorage.setItem('current-table-id', message.newTableId.toString());
          localStorage.setItem('table-session-token', message.newTableToken);
          
          setTableId(message.newTableId);
          setTableName(message.newTableName || `Bàn ${message.newTableId}`);
          
          const newPath = `/table/${message.newTableId}`;
          window.history.replaceState(null, '', newPath);
          
          toast.info(`Bạn đã được chuyển sang ${message.newTableName}`, {
            duration: 5000,
            icon: '🔄'
          });
        }
        break;

      case 'PAYMENT_CONFIRMED':
        if (message.qrCodeUrl) {
          setPaymentQrCode(message.qrCodeUrl);
          toast.success("Nhân viên đã xác nhận. Vui lòng quét mã để thanh toán.", {
            duration: 5000,
          });
        }
        break;

      case 'ORDER_UPDATE':
        setLastOrderUpdate(Date.now());
        break;

      case 'TRANSFER_SUCCESS':
        localStorage.removeItem('table-session-token');
        localStorage.removeItem('customer-cart');
        localStorage.removeItem('current_order_id');
        
        setIsTableOpened(false); 
        setPaymentQrCode(null);
        setIsWaitingForStaff(false);
        setLastOrderUpdate(0);

        toast.success("Thanh toán thành công! Cảm ơn quý khách và hẹn gặp lại.", {
            duration: 5000,
            icon: '✅'
        });
        break;

      // --- MỚI: Xử lý sự kiện Menu thay đổi ---
      case 'MENU_STATUS_CHANGED':
        setLastMenuUpdate(Date.now());
        // Có thể hiện thông báo nhỏ nếu muốn
        // toast.info("Thực đơn vừa được cập nhật.");
        break;
        
      default:
        if (message && typeof message === 'object' && 'id' in message && 'status' in message) {
             setLastOrderUpdate(Date.now());
        }
        break;
    }
  }, []);

  useEffect(() => {
    if (tableId) {
      const tableTopic = `/topic/table/${tableId}`;
      const menuTopic = `/topic/menus`; // Topic chung cho menu
      
      socketService.disconnect(); 

      socketService.connect(() => {
        // Subscribe topic riêng của bàn
        socketService.subscribe<SocketMessage>(tableTopic, handleSocketMessage);
        
        // --- MỚI: Subscribe topic menu chung ---
        socketService.subscribe<SocketMessage>(menuTopic, handleSocketMessage);
      });
    }

    return () => {
      if (tableId) {
        socketService.disconnect();
      }
    };
  }, [tableId, handleSocketMessage]);

  const joinTable = useCallback(async (id: number) => {
    setTableId(id);
    localStorage.setItem('current-table-id', id.toString());
    try {
      const data = await tableService.getTableInfo(id);
      setTableName(data.name);
    } catch (error) {
      console.warn("Failed to fetch table info:", error);
    }
  }, []);

  const requestOpenTable = async (id: number) => {
    setIsWaitingForStaff(true);
    try {
      await tableService.requestOpenTable(id);
      toast.info("Đã gửi yêu cầu. Vui lòng đợi nhân viên...");
    } catch (error) {
      setIsWaitingForStaff(false);
      console.error(error); 
      toast.error("Lỗi kết nối.");
    }
  };
  
  const clearPaymentState = () => setPaymentQrCode(null);

  return (
    <TableContext.Provider value={{ 
      tableId, 
      tableName, 
      isWaitingForStaff, 
      isTableOpened,
      paymentQrCode,      
      lastOrderUpdate,
      lastMenuUpdate, // Expose ra ngoài
      requestOpenTable,
      joinTable,
      clearPaymentState
    }}>
      {children}
    </TableContext.Provider>
  );
}
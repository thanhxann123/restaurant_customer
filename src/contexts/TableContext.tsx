import React, { useEffect, useState } from 'react';
import { socketService } from '../services/socket.service';
import { tableService } from '../services/table.service';
import { toast } from 'sonner';
import { TableContext } from "./definitions";

export function TableProvider({ children }: { children: React.ReactNode }) {
  const [tableId, setTableId] = useState<number | null>(null);
  const [tableName, setTableName] = useState<string | null>(null);
  const [isWaitingForStaff, setIsWaitingForStaff] = useState(false);
  
  const [isTableOpened, setIsTableOpened] = useState(() => {
    const token = localStorage.getItem('table-session-token');
    return !!token;
  });

  const handleSocketMessage = (message: { type: string, token: string }) => {
    console.log("Socket received:", message);
    
    if (message.type === 'TABLE_OPENED') {
      const { token } = message;
      localStorage.setItem('table-session-token', token);
      
      setIsWaitingForStaff(false);
      setIsTableOpened(true);
      toast.success("Bàn đã được mở! Chúc quý khách ngon miệng.");
    }
  };

  useEffect(() => {
    if (tableId && !isTableOpened) {
      socketService.connect(() => {
        console.log(`Subscribing to table ${tableId}...`);
        socketService.subscribe<{ type: string, token: string }>(`/topic/table/${tableId}`, (message) => {
          handleSocketMessage(message);
        });
      });
    }

    return () => {
      if (!isTableOpened) {
        socketService.disconnect();
      }
    };
  }, [tableId, isTableOpened]);

  const joinTable = (id: number) => {
    setTableId(id);
    setTableName(`Bàn số ${id}`); 
  };

  const requestOpenTable = async (id: number) => {
    setIsWaitingForStaff(true);
    try {
      await tableService.requestOpenTable(id);
      toast.info("Đã gửi yêu cầu. Vui lòng đợi nhân viên xác nhận...");
    } catch (error) {
      console.error(error);
      setIsWaitingForStaff(false);
      toast.error("Không thể gửi yêu cầu. Vui lòng thử lại hoặc gọi nhân viên.");
    }
  };

  return (
    <TableContext.Provider value={{ 
      tableId, 
      tableName, 
      isWaitingForStaff, 
      isTableOpened,
      requestOpenTable,
      joinTable
    }}>
      {children}
    </TableContext.Provider>
  );
}
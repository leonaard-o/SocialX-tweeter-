"use client";
import Logo from "@/components/logo";
import { Spinner } from "@/components/spinner";
import useNotifications from "@/hooks/useNotification";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import React from "react";

// Define la interfaz para las notificaciones
interface NotificationType {
    id: number; // Cambia a number si tu ID es numérico
    body: string;
    userId: number;
    user: {
      username: string;
    };
  }
  

const NotificationFeed = () => {
    const router = useRouter();
    
    const { data, isLoading, deleteNotification} = useNotifications(); // Nueva función
  const notifications = data?.data ?? [];

  if (isLoading) {
    return (
      <div
        className="flex flex-col h-[25vh] 
      items-center w-full justify-center"
      >
        <Spinner size="icon" />
      </div>
    );
  }

  if (notifications?.length === 0) {
    return (
      <div className=" w-full   p-6">
        <h5
          className="text-2xl text-center
         font-bold dark:text-white/80"
        >
          No notifications
        </h5>
      </div>
    );
  }
 
  return (
    <div className="flex flex-col w-full">
      {notifications.map((notification: NotificationType) => (
        <div
          key={notification.id}
          onClick={() => router.push("/" + notification.user.username)}
          className="cursor-pointer flex flex-row w-full items-center justify-between p-6 gap-4 border-b hover:bg-gray-100 dark:hover:bg-gray-800 group"
        >
          <div className="flex items-center gap-4">
            <Logo className="!size-5" />
            <p className="dark:text-white">{notification.body}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Evita la redirección si se clickea el botón
              deleteNotification(notification.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
          >
            <Trash size={20} />
          </button>
        </div>
      ))}
    </div>
  );
};
export default NotificationFeed;
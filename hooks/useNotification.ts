"use client";
import { BASE_URL } from "@/lib/base-url";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useNotifications = () => {
  const queryClient = useQueryClient();
  
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetch(`${BASE_URL}/api/notifications`).then(res => res.json()),
  });

  // Función para eliminar notificaciones
  // hooks/useNotification.ts
const deleteNotification = async (notificationId: number) => {
    try {
      await axios.delete(`/api/notifications/${notificationId}`, {
        withCredentials: true // ¡Envía cookies de autenticación!
      });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (error) {
      console.error("Error eliminando:", error);
      throw error;
    }
  };

  return {
    data,
    error,
    isLoading,
    refetch,
    deleteNotification // Nueva función exportada
  };
};

export default useNotifications;
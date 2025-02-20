interface NotificationType {
    id: number;
    body: string;
    post?: {
      id: number;
      user: {
        username: string;
      };
    };
  }
 
  
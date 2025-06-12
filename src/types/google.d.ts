interface Window {
  google: {
    accounts: {
      id: {
        initialize: (config: {
          client_id: string;
          callback: (response: { credential: string }) => void;
        }) => void;
        renderButton: (
          element: HTMLElement,
          config: {
            type: string;
            theme: string;
            size: string;
            text: string;
            shape: string;
            logo_alignment: string;
            width: number;
          }
        ) => void;
      };
    };
  };
} 
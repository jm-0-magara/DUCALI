// src/app/dashboard/customer/components/CustomerMessages.tsx
import React from 'react';
import MessagingInterface from '../../../../components/messaging/MessagingInterface';

export function CustomerMessages() {
  return (
    <div className="h-full">
      <MessagingInterface 
        compact={false}
        maxHeight="h-[700px]"
        hideNewMessageButton={true}
        className="w-full"
      />
    </div>
  );
}
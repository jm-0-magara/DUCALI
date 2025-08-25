// src/app/dashboard/artisan/components/ArtisanMessages.tsx
import React from 'react';
import MessagingInterface from '../../../../components/messaging/MessagingInterface';

export function ArtisanMessages() {
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
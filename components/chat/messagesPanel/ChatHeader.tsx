import React from 'react';

interface ChatHeaderProps {
  title: string;
}

export function ChatHeader({ title }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {/* Add any other header elements here if needed */}
    </div>
  );
}

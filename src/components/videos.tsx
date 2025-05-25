"use client";
// import { a } from "framer-motion/client";
import React from "react";

export default function Videos(
  {
  appId,
  channelName,
}: {
  appId: string;
  channelName: string;
}
) {
  return <div>
    Your Video UI goes here
    {appId} - {channelName}
    </div>;
}

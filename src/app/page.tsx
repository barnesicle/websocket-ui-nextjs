'use client';
import Image from "next/image";
import {useEffect, useState} from "react";
import { useSearchParams } from 'next/navigation'

type FeedMessage = {
    userId: string,
    messageId: string,
    message: string
}

function useWebSocket(url: string) {
    const [messages, setMessages] = useState<FeedMessage[]>([]);

    useEffect(() => {
        const webSocket = new WebSocket(url);

        webSocket.onopen = (event) => console.log("WebSocket opened", event);

        webSocket.onmessage = (event) => {
            console.log("onmessage", event.data);
            const data = JSON.parse(event.data);
            setMessages(prev => [...prev, ...(Array.isArray(data) ? data : [data])]);
        };

        return () => webSocket.close();
    }, [url]);

    return messages;
}

export default function Home() {

    const searchParams = useSearchParams()
    const messages = useWebSocket(searchParams.get('url') || '');

  console.log('Messages', messages)

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">

          <h2>Messages</h2>

          {messages.map(message => {
              return <div key={message.messageId}>
                  {message.userId} - {message.message}
              </div>
          })}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}

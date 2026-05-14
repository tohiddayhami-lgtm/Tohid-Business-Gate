import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '@/src/lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, limit, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Send, X, User } from 'lucide-react';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useTranslation } from '@/src/hooks/useLocale';

interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: any;
}

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const { user } = useAuthStore();
  const { isRtl } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !user) return;

    const q = query(
      collection(db, 'chats', user.uid, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [isOpen, user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    try {
      await addDoc(collection(db, 'chats', user.uid, 'messages'), {
        senderId: user.uid,
        text: inputText,
        createdAt: serverTimestamp()
      });
      setInputText('');
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) return null;

  return (
    <div className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-50`}>
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full shadow-2xl bg-primary hover:scale-110 transition-transform flex items-center justify-center"
        >
          <MessageCircle size={32} className="text-white" />
          <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
        </Button>
      ) : (
        <Card className="w-80 md:w-96 rounded-[2rem] shadow-2xl border-none overflow-hidden flex flex-col h-[500px]">
          <CardHeader className="bg-primary p-4 flex flex-row items-center justify-between text-white">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><User size={20} /></div>
               <div>
                  <CardTitle className="text-sm font-bold">OmanGate Support</CardTitle>
                  <p className="text-[10px] opacity-70 uppercase tracking-widest font-bold">Online</p>
               </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform"><X size={20} /></button>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto p-4 space-y-4" ref={scrollRef}>
             {messages.length === 0 && (
               <div className="text-center py-10">
                  <p className="text-xs text-slate-400 font-medium">Start a conversation with our specialists.</p>
               </div>
             )}
             {messages.map((m) => (
               <div key={m.id} className={`flex ${m.senderId === user.uid ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${m.senderId === user.uid ? 'bg-primary text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                     {m.text}
                  </div>
               </div>
             ))}
          </CardContent>
          <form className="p-4 bg-slate-50 border-t flex gap-2" onSubmit={sendMessage}>
             <Input 
                placeholder="Type a message..." 
                className="rounded-xl border-slate-200"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
             />
             <Button type="submit" size="icon" className="rounded-xl bg-primary shrink-0"><Send size={18} /></Button>
          </form>
        </Card>
      )}
    </div>
  );
};

export default LiveChat;

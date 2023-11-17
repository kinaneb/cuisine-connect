"use client"
import SmartToyIcon from '@mui/icons-material/SmartToy';
import React, {useEffect, useRef, useState} from "react";
import {Button, IconButton} from "@mui/material";
import {getChatBotResponse} from "@/components/ServerActions.server";

type Message = {
    author: 'user' | 'chatbot';
    text: string;
};
export default function ChatBot () {
    const [chatDisplay, setChatDisplay] = useState("none");
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const bottomOfChat = useRef<HTMLDivElement>(null);
    const [isWaitingResponse, setIsWaitingResponse] = useState(false);

    function changeWaitingStatus (status: boolean) {
        return setIsWaitingResponse(status)
    }
    const sendMessage = async (message: string): Promise<void> => {
        if (message.trim() === '') return;

        const userMessage: Message = { author: 'user', text: message };
        setMessages((msgs) => [...msgs, userMessage]);
        changeWaitingStatus(true);
        const chatBotResponse = await getChatBotResponse({message});
        setMessages((msgs) => [...msgs, { author: 'chatbot', text: chatBotResponse }]);
        setUserInput('');
        changeWaitingStatus(false);
    };
    const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setUserInput(e.target.value);
        e.target.value = '';
    };
    useEffect(() => {
        bottomOfChat.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    const handleSendMessage = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>): void => {
        if (e instanceof KeyboardEvent && e.key !== 'Enter') return;
        e.preventDefault();
        sendMessage(userInput);
    };
    const handelOpenChat = () => {
        setChatDisplay(chatDisplay == "none" ? "block" : "none")
    }
    // const WaitingResponse = () => {
    //     return <h2>🌀 waiting...</h2>;
    // }
    return (
        <div id="chatWindow" className={'fixed flex items-end bottom-20 right-20 z-50'} >
            <div id="chatWindow" className={'flex flex-col items-end w-80 h-96 bg-white bg-opacity-70 rounded-2xl pt-4'} style={{
                display:chatDisplay
            }}><div className={'overflow-scroll h-80'} >
                <div className="chat-container">
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`rounded-2xl my-1 p-2 ${msg.author} ${(msg.author == 'user') ? 'ml-2 mr-4 bg-neutral-200' : 'ml-4 mr-2 bg-neutral-300'}`}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={bottomOfChat} />
                    </div>

                </div>
            </div>
                <form onSubmit={handleSendMessage} className="chat-input flex justify-between ">
                    {
                        !isWaitingResponse &&
                        <input id="messageInput" type="text" className={'focus:outline-none rounded-2xl ml-2 px-2 w-max'} value={userInput}
                            onChange={handleUserInput}/>
                    }
                    {
                        isWaitingResponse &&
                        <input type="text" placeholder={" 🌀 waiting response ..."} className={'rounded-2xl ml-5 px-2'}  disabled/>
                    }
                    <Button className={'text-center h-6 pr-5'}  color={'inherit'} type="submit" disabled={isWaitingResponse}>
                        Send</Button>
                </form>

            </div>
            <div className={'rounded-full border-2 border-white border-opacity-70'}>
                <IconButton className={'py-0'} onClick={handelOpenChat}><SmartToyIcon className={'text-white text-opacity-70'} /></IconButton>
            </div>
        </div>
    )
}
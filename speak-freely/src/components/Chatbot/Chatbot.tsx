"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Chatbot.module.css";

type Message = { id: string; role: "user" | "assistant"; content: string };

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // <-- typing state

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  // focus input when opening
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // close with ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // click outside to close (only when open)
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!panelRef.current) return;
      const target = e.target as Node;
      if (!panelRef.current.contains(target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // always scroll to latest message / typing bubble
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const toggle = () => setOpen((p) => !p);
  const minimize = () => setOpen(false);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newUserMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    setMessages((m) => [...m, newUserMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, newUserMsg] }),
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = await res.json(); // expecting { role, content }
      const reply: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.content ?? "Thanks! I’m thinking…",
      };
      setMessages((m) => [...m, reply]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Hmm, I couldn’t reach the server. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onEnterSend = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Floating action button */}
      <button
        type="button"
        className={`${styles.fab} ${open ? styles.fabHidden : ""}`}
        aria-label="Open chat"
        onClick={toggle}
      >
        <Image
          src="/chatbotIcon.png"
          alt=""
          width={44}
          height={44}
          className={styles.fabIcon}
          priority
        />
      </button>

      {/* Chat panel */}
      <div
        ref={panelRef}
        className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Speak Freely chat"
      >
        <header className={styles.header}>
          <div className={styles.headerBrand}>
            <Image
              src="/Solid megaphone.png"
              alt="Speak Freely"
              width={120}
              height={32}
              className={styles.brandLogo}
            />
            <span className={styles.headerTitle}>GPT</span>
          </div>
          <button
            type="button"
            className={styles.minimize}
            aria-label="Minimize chat"
            onClick={minimize}
          >
            ─
          </button>
        </header>

        <div className={styles.messages} aria-live="polite">
          {messages.length === 0 ? (
            <div className={`${styles.msg} ${styles.assistant}`}>
              Ask me about free expression on campus.
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`${styles.msg} ${
                  m.role === "user" ? styles.user : styles.assistant
                }`}
              >
                {m.content}
              </div>
            ))
          )}

          {/* typing indicator */}
          {loading && (
            <div className={`${styles.msg} ${styles.assistant} ${styles.typingBubble}`}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          )}

          <div ref={endRef} />
        </div>

        <div className={styles.inputRow}>
          <textarea
            ref={inputRef}
            className={styles.input}
            placeholder="Type your question…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onEnterSend}
            rows={1}
            disabled={loading}
          />
          <button
            type="button"
            className={styles.send}
            onClick={send}
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}

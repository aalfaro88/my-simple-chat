// src/polyfills.ts
(window as any).global = window;
// Polyfill for Buffer, install the buffer package first via npm
import { Buffer } from 'buffer';
(window as any).Buffer = Buffer;

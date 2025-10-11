// src/services/soundService.js
let audio = new Audio("/sounds/notification.mp3");
audio.volume = 0.8;

export function playNotificationSound() {
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

export function stopNotificationSound() {
  audio.pause();
  audio.currentTime = 0;
}

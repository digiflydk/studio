// src/lib/ui/notify.ts
type ToastType = "success" | "error" | "info";

function createToast(message: string, type: ToastType = "info", duration = 1000) {
  if (typeof document === "undefined") return;

  const wrap = document.createElement("div");
  const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  wrap.id = id;
  wrap.setAttribute("role", "status");
  wrap.style.position = "fixed";
  wrap.style.top = "16px";
  wrap.style.right = "16px";
  wrap.style.zIndex = "9999";
  wrap.style.pointerEvents = "none"; // klik går gennem

  const box = document.createElement("div");
  box.style.pointerEvents = "auto";
  box.style.minWidth = "220px";
  box.style.maxWidth = "360px";
  box.style.padding = "10px 12px";
  box.style.borderRadius = "10px";
  box.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
  box.style.fontSize = "14px";
  box.style.lineHeight = "1.35";
  box.style.color = "#0B1220";
  box.style.background = type === "success"
    ? "#D1FAE5"      // grønlig
    : type === "error"
    ? "#FECACA"      // rødlig
    : "#E5E7EB";     // neutral

  box.textContent = message;
  wrap.appendChild(box);
  document.body.appendChild(wrap);

  // fade in
  wrap.animate([{ opacity: 0, transform: "translateY(-6px)" }, { opacity: 1, transform: "translateY(0)" }], {
    duration: 150,
    easing: "ease-out",
    fill: "forwards",
  });

  // auto-hide
  window.setTimeout(() => {
    const anim = wrap.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 200,
      easing: "ease-in",
      fill: "forwards",
    });
    anim.onfinish = () => {
      wrap.remove();
    };
  }, Math.max(300, duration));
}

export function notifySuccess(message: string, duration = 1000) {
  createToast(message, "success", duration);
}

export function notifyError(message: string, duration = 1500) {
  createToast(message, "error", duration);
}

export function notify(message: string, duration = 1000) {
  createToast(message, "info", duration);
}

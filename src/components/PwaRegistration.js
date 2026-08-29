"use client";

import { useEffect, useRef, useState } from "react";

const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000;
const EMBEDDED_DATA_VERSION = "2026-08-29";
const LEGAL_DATA_REVIEWED_LABEL = "Aug. 29, 2026";

export default function PwaRegistration() {
  const [updateReady, setUpdateReady] = useState(false);
  const [dataUpdateAvailable, setDataUpdateAvailable] = useState(false);
  const [installAvailable, setInstallAvailable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const registrationRef = useRef(null);
  const installPromptRef = useRef(null);
  const applyingUpdateRef = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      return undefined;
    }

    let cancelled = false;
    let intervalId;
    let initialStateTimer;

    const checkDataVersion = async () => {
      if (!navigator.onLine) {
        setIsOnline(false);
        return;
      }

      try {
        const response = await fetch(
          `/data-version.json?checked=${Date.now()}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          return;
        }

        const release = await response.json();

        if (!cancelled) {
          setIsOnline(true);
          setDataUpdateAvailable(release.version !== EMBEDDED_DATA_VERSION);
        }
      } catch {
        if (!cancelled) {
          setIsOnline(false);
        }
      }
    };

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      installPromptRef.current = event;
      setInstallAvailable(true);
    };

    const handleAppInstalled = () => {
      installPromptRef.current = null;
      setInstallAvailable(false);
      setIsInstalled(true);
    };

    const handleOnline = () => {
      setIsOnline(true);
      checkDataVersion();
      registrationRef.current?.update().catch(() => undefined);
    };

    const handleOffline = () => setIsOnline(false);

    initialStateTimer = window.setTimeout(() => {
      setIsOnline(navigator.onLine);
      setIsInstalled(window.matchMedia("(display-mode: standalone)").matches);
    }, 0);
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    checkDataVersion();

    if (!("serviceWorker" in navigator)) {
      return () => {
        cancelled = true;
        window.clearTimeout(initialStateTimer);
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt,
        );
        window.removeEventListener("appinstalled", handleAppInstalled);
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }

    const noticeIfWaiting = (registration) => {
      if (
        registration.waiting &&
        navigator.serviceWorker.controller &&
        !cancelled
      ) {
        setUpdateReady(true);
      }
    };

    const watchInstallingWorker = (registration) => {
      const installingWorker = registration.installing;

      if (!installingWorker) {
        return;
      }

      installingWorker.addEventListener("statechange", () => {
        if (installingWorker.state !== "installed" || cancelled) {
          return;
        }

        if (navigator.serviceWorker.controller) {
          setUpdateReady(true);
        }
      });
    };

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });

        if (cancelled) {
          return;
        }

        registrationRef.current = registration;
        noticeIfWaiting(registration);
        watchInstallingWorker(registration);
        registration.addEventListener("updatefound", () =>
          watchInstallingWorker(registration),
        );

        intervalId = window.setInterval(() => {
          if (document.visibilityState === "visible") {
            registration.update().catch(() => undefined);
            checkDataVersion();
          }
        }, UPDATE_CHECK_INTERVAL_MS);
      } catch (error) {
        console.warn("Offline support could not be enabled.", error);
      }
    };

    const handleControllerChange = () => {
      if (applyingUpdateRef.current) {
        window.location.reload();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        registrationRef.current?.update().catch(() => undefined);
        checkDataVersion();
      }
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange,
    );
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }

    return () => {
      cancelled = true;
      window.clearTimeout(initialStateTimer);
      window.removeEventListener("load", register);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange,
      );

      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  const applyUpdate = () => {
    const waitingWorker = registrationRef.current?.waiting;

    if (waitingWorker) {
      applyingUpdateRef.current = true;
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
      return;
    }

    window.location.reload();
  };

  const installApp = async () => {
    const installPrompt = installPromptRef.current;

    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
    installPromptRef.current = null;
    setInstallAvailable(false);
  };

  const newerReleaseReady = updateReady || dataUpdateAvailable;
  const shouldShowStatus = newerReleaseReady || installAvailable || !isOnline;

  if (!shouldShowStatus) {
    return null;
  }

  let statusMessage = "Ready to install on your Pixel.";

  if (newerReleaseReady) {
    statusMessage = "A newer legal-data release is available.";
  } else if (!isOnline) {
    statusMessage = "Offline mode: using the saved guide.";
  }

  return (
    <aside
      aria-live="polite"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-lg flex-wrap items-center justify-between gap-3 rounded-xl border border-[#C5A067]/50 bg-[#0B1120] px-4 py-3 text-sm text-white shadow-2xl"
    >
      <p className="min-w-0 flex-1">
        <span className="block font-medium">{statusMessage}</span>
        <span className="block text-xs text-slate-300">
          Saved legal data reviewed {LEGAL_DATA_REVIEWED_LABEL}.
        </span>
      </p>
      <div className="flex shrink-0 gap-2">
        {installAvailable && !isInstalled && (
          <button
            type="button"
            onClick={installApp}
            className="rounded-lg border border-[#C5A067] px-3 py-2 font-semibold text-[#e2c797] transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0B1120]"
          >
            Install on Pixel
          </button>
        )}
        {newerReleaseReady && (
          <button
            type="button"
            onClick={applyUpdate}
            className="rounded-lg bg-[#C5A067] px-3 py-2 font-semibold text-[#0B1120] transition hover:bg-[#d4b47e] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0B1120]"
          >
            Update
          </button>
        )}
      </div>
    </aside>
  );
}

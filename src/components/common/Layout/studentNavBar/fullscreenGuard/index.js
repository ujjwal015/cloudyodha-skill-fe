import { useEffect, useCallback, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ExitFullscreenModeAlert,
  getLocal,
  storeLocal,
  warningToast,
} from "../../../../../utils/projectHelper";
import { useDispatch, } from "react-redux";
import useFullscreen from "../../../../../hooks/useFullscreen";
import { getSuspiciousActivityApi } from "../../../../../api/studentApi";

const getPersistedData = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const persistData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error persisting data:", error);
  }
};

const FullscreenGuard = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname = "" } = useLocation();
  const { batchId, candidateId } = useParams();
  const { enterFullscreen } = useFullscreen();

  const [reloadAttempts, setReloadAttempts] = useState(() =>
    getPersistedData("reloadAttempts", 0)
  );
  const [hasShownReloadAlert, setHasShownReloadAlert] = useState(() =>
    getPersistedData("hasShownReloadAlert", false)
  );
  const [suspiciousActivities, setSuspiciousActivities] = useState(() =>
    getPersistedData("suspiciousActivities", [])
  );

  const getInitialLogin = getLocal("initialLogin");

  useEffect(() => {
    persistData("reloadAttempts", reloadAttempts);
  }, [reloadAttempts]);

  useEffect(() => {
    persistData("suspiciousActivities", suspiciousActivities);
  }, [suspiciousActivities]);

  useEffect(() => {
    if (getInitialLogin) {
      storeLocal(false, "initialLogin");
    }
  }, [getInitialLogin]);

  const dispatchSuspiciousActivity = useCallback(
    (reloadAttemptLeftCount = 0) => {
      dispatch(
        getSuspiciousActivityApi(
          () => {},
          batchId,
          candidateId,
          navigate,
          reloadAttemptLeftCount
        )
      );
    },
    [batchId, candidateId, dispatch, navigate]
  );

  const logSuspiciousActivity = useCallback(
    (type, message = null) => {
      const activity = {
        type,
        message,
        timestamp: new Date().toISOString(),
      };

      setSuspiciousActivities((prev) => {
        const newActivities = [...prev, activity];
        persistData("suspiciousActivities", newActivities);
        dispatchSuspiciousActivity();
        return newActivities;
      });

      if (type === "reload") {
        setReloadAttempts((prev) => {
          const newAttempts = prev + 1;
          persistData("reloadAttempts", newAttempts);

          if (newAttempts) {
            dispatchSuspiciousActivity(newAttempts);
          }
          return newAttempts;
        });
      }

      if (message) {
        warningToast(message);
      }
    },
    [dispatchSuspiciousActivity]
  );

  const checkFullscreen = useCallback(() => {
    const isFullscreen =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;

    if (!isFullscreen && !pathname.includes("login")) {
      logSuspiciousActivity("fullscreen_exit");
      ExitFullscreenModeAlert(
        "Fullscreen mode exited",
        enterFullscreen,
        dispatch,
        navigate
      );
    }
  }, [pathname, enterFullscreen, dispatch, navigate, logSuspiciousActivity]);

  const handleKeyDown = useCallback(
    (e) => {
      const blockedKeys = {
        // Single keys
        F12: "Trying to access developer tools is not allowed",
        123: "Trying to access developer tools is not allowed",
        escape: "Trying to escape fullscreen is not allowed",

        // Key combinations
        "ctrl+shift+i": "Developer tools are not allowed",
        "ctrl+shift+j": "Developer console is not allowed",
        "ctrl+shift+c": "Inspect element is not allowed",
        "ctrl+u": "View page source is not allowed",

        // Copy/paste
        "ctrl+c": "Copy is not allowed",
        "ctrl+v": "Paste is not allowed",
        "ctrl+x": "Cut is not allowed",

        // Navigation
        "ctrl+r": "Refresh is not allowed",
        "ctrl+shift+r": "Hard refresh is not allowed",
        "ctrl+t": "New tab is not allowed",
        "ctrl+n": "New window is not allowed",
        "ctrl+shift+n": "Incongito window is not allowed",
        "ctrl+w": "Close tab is not allowed",
        "ctrl+shift+w": "Close window is not allowed",
        "ctrl+p": "Print is not allowed",

        //screenshoot and webpage save
        "ctrl+s": "Save not allowed",
        "ctrl+g": "Screenshoot not allowed",
        "ctrl+shift+s": "Screenshoot not allowed",
      };

      // Build the current key combination
      let combo = [];
      if (e.ctrlKey) combo.push("ctrl");
      if (e.shiftKey) combo.push("shift");
      if (e.altKey) combo.push("alt");
      if (e.metaKey) combo.push("meta");

      // Add the actual key (but skip if it's just a modifier key)
      if (!["Control", "Shift", "Alt", "Meta"].includes(e.key)) {
        combo.push(e.key.toLowerCase());
      }
      const currentCombo = combo.join("+");

      // Check if this combination is blocked
      if (
        blockedKeys[currentCombo] ||
        blockedKeys[e.key] ||
        blockedKeys[e.keyCode.toString()]
      ) {
        logSuspiciousActivity(
          currentCombo,
          blockedKeys[currentCombo] ||
            blockedKeys[e.key] ||
            blockedKeys[e.keyCode.toString()]
        );

        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Additional special cases
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") {
        warningToast("Developer tools are not allowed");
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j") {
        warningToast("Developer console is not allowed");
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") {
        warningToast("Inspect element is not allowed");
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    },
    [logSuspiciousActivity]
  );

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      logSuspiciousActivity("window_switch");
      ExitFullscreenModeAlert(
        "Window switch detected",
        enterFullscreen,
        dispatch,
        navigate
      );
    }
  }, [enterFullscreen, dispatch, navigate, logSuspiciousActivity]);

  useEffect(() => {
    const fullscreenEvents = [
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "MSFullscreenChange",
    ];

    fullscreenEvents.forEach((event) => {
      document.addEventListener(event, checkFullscreen);
    });

    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      fullscreenEvents.forEach((event) => {
        document.removeEventListener(event, checkFullscreen);
      });
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    checkFullscreen,
    handleKeyDown,
    handleContextMenu,
    handleVisibilityChange,
    dispatch,
    enterFullscreen,
    navigate,
    hasShownReloadAlert,
    // getInitialLogin,`
  ]);

  useEffect(() => {
    const navigationEntries = performance.getEntriesByType("navigation");

    if (
      (navigationEntries.length > 0 &&
        navigationEntries[0].type === "reload" &&
        !getInitialLogin) ||
      (navigationEntries[0].type === "navigate" && !getInitialLogin)
    ) {
      if (!hasShownReloadAlert) {
        setHasShownReloadAlert(true);
        logSuspiciousActivity("reload");
        ExitFullscreenModeAlert(
          "Page reload detected",
          enterFullscreen,
          dispatch,
          navigate,
          "isReloadedSwal"
        );
      }
    }
  }, []);

  const checkDevToolsByDebugger = useCallback(() => {
    const startTime = performance.now();
    debugger;
    const endTime = performance.now();

    if (endTime - startTime > 100) {
      logSuspiciousActivity(
        "dev_tools_open",
        "Developer tools detected via debugger"
      );
      return true;
    }
    return false;
  }, [logSuspiciousActivity]);

  const checkDevTools = useCallback(() => {
    if (checkDevToolsByDebugger()) return true;
    return false;
  }, [checkDevToolsByDebugger]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (checkDevTools()) {
        ExitFullscreenModeAlert(
          "Developer tools detected",
          enterFullscreen,
          dispatch,
          navigate
        );
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [checkDevTools, dispatch, enterFullscreen, navigate]);

  return <>{children}</>;
};

export default FullscreenGuard;

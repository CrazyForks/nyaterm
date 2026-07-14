import type { Terminal } from "@xterm/xterm";
import { logger } from "@/lib/logger";

interface Disposable {
  dispose(): void;
}

interface XtermCompositionHelperInternals {
  _isComposing?: unknown;
  _isSendingComposition?: unknown;
  isComposing?: unknown;
  _textareaChangeTimer?: unknown;
}

interface XtermCoreInternals {
  _inputEvent?: unknown;
  _keyDownSeen?: unknown;
  _compositionHelper?: XtermCompositionHelperInternals;
  textarea?: HTMLTextAreaElement | null;
}

interface TerminalWithCoreInternals extends Terminal {
  _core?: XtermCoreInternals;
}
// PRINTABLE_ASCII removed — now suppresses all stale _inputEvent data

const noopDisposable: Disposable = {
  dispose() {},
};

function isCompositionActive(helper: XtermCompositionHelperInternals | undefined): boolean {
  if (!helper) return false;

  return (
    helper._isComposing === true ||
    helper._isSendingComposition === true ||
    helper.isComposing === true ||
    helper._textareaChangeTimer !== undefined
  );
}

function warnSkipped(reason: string, sessionId?: string): void {
  logger.warn({
    domain: "terminal.input",
    event: "ime_compatibility_skipped",
    message: "Skipped IME compatibility patch",
    ids: sessionId ? { session_id: sessionId } : undefined,
    data: { reason },
  });
}

export function installMacImeCompatibilityPatch(
  terminal: Terminal,
  _enabled: boolean,
  sessionId?: string,
): Disposable {
  const core = (terminal as TerminalWithCoreInternals)._core;
  if (!core) {
    warnSkipped("missing_core", sessionId);
    return noopDisposable;
  }
  if (typeof core._inputEvent !== "function") {
    warnSkipped("missing_input_event", sessionId);
    return noopDisposable;
  }
  if (typeof core._keyDownSeen !== "boolean") {
    warnSkipped("missing_key_down_seen", sessionId);
    return noopDisposable;
  }
  if (!core._compositionHelper) {
    warnSkipped("missing_composition_helper", sessionId);
    return noopDisposable;
  }
  if (
    typeof core._compositionHelper._isComposing !== "boolean" &&
    typeof core._compositionHelper.isComposing !== "boolean"
  ) {
    warnSkipped("missing_is_composing", sessionId);
    return noopDisposable;
  }
  if (typeof core._compositionHelper._isSendingComposition !== "boolean") {
    warnSkipped("missing_is_sending_composition", sessionId);
    return noopDisposable;
  }
  if (!(core.textarea instanceof HTMLTextAreaElement)) {
    warnSkipped("missing_textarea", sessionId);
    return noopDisposable;
  }

  const originalInputEvent = core._inputEvent;
  const textarea = core.textarea;
  let latestKeydownWas229 = false;

  const handleKeyDown = (event: KeyboardEvent) => {
    latestKeydownWas229 = event.keyCode === 229;
  };

  /**
   * Suppress stale/duplicate _inputEvent data when the CompositionHelper is
   * active or has a pending change timer, since CompositionHelper will send
   * the correct data.
   */
  const patchedInputEvent = function patchedInputEvent(this: XtermCoreInternals, ev: InputEvent) {
    const was229 = latestKeydownWas229;
    latestKeydownWas229 = false;

    // 1. If CompositionHelper is active (composing, sending composition, or has a textarea change timer),
    // it will handle sending the text. We must suppress the native _inputEvent to prevent duplicate input.
    if (isCompositionActive(this._compositionHelper)) {
      logger.debug({
        domain: "terminal.input",
        event: "ime_input_suppressed",
        message: "Suppressed duplicate input event handled by CompositionHelper",
        data: { data: ev.data, inputType: ev.inputType },
      });
      ev.preventDefault();
      return true;
    }

    // 2. If CompositionHelper is NOT active, but the keydown was 229 and _keyDownSeen is true,
    // the native _inputEvent would normally ignore this input because it thinks a key is pressed.
    // We temporarily clear _keyDownSeen to force the native _inputEvent to accept and send the text.
    const shouldForceInput =
      ev.inputType === "insertText" &&
      !!ev.data &&
      !ev.isComposing &&
      was229 &&
      this._keyDownSeen === true;

    if (shouldForceInput) {
      logger.debug({
        domain: "terminal.input",
        event: "ime_input_forced",
        message: "Forced native _inputEvent to process input (macOS compatibility)",
        data: { data: ev.data },
      });
      const originalKeyDownSeen = this._keyDownSeen;
      this._keyDownSeen = false;
      try {
        return originalInputEvent.call(this, ev);
      } finally {
        this._keyDownSeen = originalKeyDownSeen;
      }
    }

    return originalInputEvent.call(this, ev);
  };

  // biome-ignore lint/suspicious/noExplicitAny: Accessing xterm.js private compositionHelper
  const compositionHelper = core._compositionHelper as Record<string, any> | undefined;
  const originalCompositionStart = compositionHelper?.compositionstart;
  if (originalCompositionStart && compositionHelper) {
    // biome-ignore lint/suspicious/noExplicitAny: xterm compositionstart context and arguments
    compositionHelper.compositionstart = function (this: any, ...args: any[]) {
      if (this._textareaChangeTimer) {
        window.clearTimeout(this._textareaChangeTimer);
        this._textareaChangeTimer = undefined;
      }
      return originalCompositionStart.apply(this, args);
    };
  }

  const handleCompositionEnd = () => {
    // Clear textarea value after CompositionHelper has processed the end of composition
    setTimeout(() => {
      if (textarea.value !== "") {
        textarea.value = "";
      }
    }, 0);
  };

  textarea.addEventListener("keydown", handleKeyDown, true);
  textarea.addEventListener("compositionend", handleCompositionEnd, false);
  core._inputEvent = patchedInputEvent;

  return {
    dispose() {
      textarea.removeEventListener("keydown", handleKeyDown, true);
      textarea.removeEventListener("compositionend", handleCompositionEnd, false);
      if (core._inputEvent === patchedInputEvent) {
        core._inputEvent = originalInputEvent;
      }
      if (originalCompositionStart && compositionHelper) {
        compositionHelper.compositionstart = originalCompositionStart;
      }
    },
  };
}

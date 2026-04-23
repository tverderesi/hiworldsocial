import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useDisplayProfile, useForm } from "./hooks";

describe("hooks", () => {
  it("updates form state and invokes the submit callback", () => {
    const callback = vi.fn();
    const { result } = renderHook(() =>
      useForm(callback, { username: "", email: "" })
    );

    act(() => {
      result.current.onChange({
        target: { name: "username", value: "alice" },
      });
    });

    expect(result.current.values).toMatchObject({ username: "alice" });

    act(() => {
      result.current.onSubmit({ preventDefault: vi.fn() });
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("toggles profile display state", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDisplayProfile(false, callback));

    act(() => {
      result.current.onClick({ preventDefault: vi.fn() } as never);
    });

    expect(result.current.showProfile).toBe(true);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

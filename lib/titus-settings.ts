// Titus's accessibility/sensory preferences
export function getTitusSettings() {
  if (typeof window === "undefined") {
    return { soundEnabled: true, reducedMotion: false };
  }
  return {
    soundEnabled: localStorage.getItem("titus-sound-pref") !== "false",
    reducedMotion: localStorage.getItem("titus-reduced-motion") === "true",
  };
}

export function setTitusSoundPref(enabled: boolean) {
  localStorage.setItem("titus-sound-pref", String(enabled));
}

export function setTitusReducedMotion(enabled: boolean) {
  localStorage.setItem("titus-reduced-motion", String(enabled));
}

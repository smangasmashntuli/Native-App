import * as Haptics from 'expo-haptics';

// Haptic feedback helpers. All calls are wrapped so unsupported platforms
// (e.g. web) fail silently instead of throwing.

const safe = (fn) => {
  try {
    const result = fn();
    if (result && typeof result.catch === 'function') result.catch(() => {});
  } catch (e) {
    // no-op
  }
};

/** Light tap feedback — used for buttons, chips and row presses. */
export const light = () =>
  safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));

/** Medium tap feedback — used for primary/hero actions. */
export const medium = () =>
  safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));

/** Success notification — used after completing a flow (login, submit). */
export const success = () =>
  safe(() =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  );

/** Warning notification — used for errors / risky actions. */
export const warn = () =>
  safe(() =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
  );

export default { light, medium, success, warn };

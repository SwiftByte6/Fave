export type AuthPopupDetail = {
  nextPath?: string;
};

export const AUTH_POPUP_EVENT = 'favee:open-auth-popup';

export const openAuthPopup = (nextPath: string = '/checkout') => {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent<AuthPopupDetail>(AUTH_POPUP_EVENT, {
      detail: { nextPath },
    })
  );
};
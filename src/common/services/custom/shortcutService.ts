interface ShortcutAction {
  key: string;
  ctrlKey: boolean;
  action: () => void;
}

class ShortcutService {
  private actions: ShortcutAction[] = [];
  private isCtrlPressed: boolean = false;

  constructor() {
    document.addEventListener('keydown', this.handleKeydown);
    document.addEventListener('keyup', this.handleKeyup);
  }

  registerShortcut(key: string, ctrlKey: boolean, action: () => void): void {
    this.actions.push({ key, ctrlKey, action });
  }

  unregisterShortcut(key: string, ctrlKey: boolean): void {
    this.actions = this.actions.filter(
      (action) => !(action.key === key && action.ctrlKey === ctrlKey),
    );
  }

  handleKeydown = (e: KeyboardEvent): void => {
    this.actions.forEach(({ key, ctrlKey, action }) => {
      if (e.key === key && ctrlKey == e.ctrlKey) {
        e.preventDefault();
        action();
      }
    });
  };

  handleKeyup = (e: KeyboardEvent): void => {
    if (e.key === 'Control') {
      this.isCtrlPressed = false;
    }
  };
}

export const shortcutService = new ShortcutService();

type LoaderListener = (isLoading: boolean) => void;

class LoaderService {
  private loadingCount = 0;
  private listeners: LoaderListener[] = [];

  show() {
    this.loadingCount++;
    this.notifyListeners();
  }

  hide() {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    this.notifyListeners();
  }

  subscribe(listener: LoaderListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    const isLoading = this.loadingCount > 0;
    this.listeners.forEach((listener) => listener(isLoading));
  }

  isLoading() {
    return this.loadingCount > 0;
  }
}

export const loaderService = new LoaderService();

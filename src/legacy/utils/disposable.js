export async function  dispose(disposables) {
  disposables.forEach(async disposable => await disposable.dispose());
}
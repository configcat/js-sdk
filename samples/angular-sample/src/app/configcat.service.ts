import { isDevMode, Injectable, type OnDestroy } from '@angular/core';
import type { IConfigCatClient, IConfigCatClientSnapshot, SettingValue, User, SettingTypeOf } from 'configcat-js';
import { createConsoleLogger, LogLevel, getClient, PollingMode } from 'configcat-js';
import { BehaviorSubject, distinctUntilChanged, map, type Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigCatService implements OnDestroy {
  public readonly client: IConfigCatClient;

  private readonly snapshotSubject = new BehaviorSubject<IConfigCatClientSnapshot | null>(null);
  readonly snapshot$ = this.snapshotSubject.asObservable();
  get currentSnapshot() { return this.snapshotSubject.value; }

  private defaultUser?: User;
  
  constructor() { 
    // Setting log level to Info to show detailed feature flag evaluation
    const logger = createConsoleLogger(isDevMode() ? LogLevel.Info : LogLevel.Warn)

    // When using snapshots, it is recommended to use Auto Polling.
    // See the Docs:
    // * https://configcat.com/docs/sdk-reference/js/#polling-modes
    // * https://configcat.com/docs/sdk-reference/js/#snapshots-and-synchronous-feature-flag-evaluation
    this.client = getClient("configcat-sdk-1/PKDVCLf-Hq-h-kCzMp-L7Q/tiOvFw5gkky9LFu1Duuvzw", PollingMode.AutoPoll, {
      pollIntervalSeconds: 5,
      logger,
      setupHooks: hooks => hooks.on("configChanged", () => this.snapshotSubject.next(this.client.snapshot()))
    });

    this.client.waitForReady().then(() => this.snapshotSubject.next(this.client.snapshot()));
  }

  ngOnDestroy(): void { this.client.dispose(); }

  setDefaultUser(user: User) { this.client.setDefaultUser(this.defaultUser = user); }

  clearDefaultUser() { this.client.clearDefaultUser(), this.defaultUser = void 0; }

  getValue<T extends SettingValue>(key: string, defaultValue: T, user?: User): Observable<SettingTypeOf<T>> {
    return this.snapshotSubject.pipe(
      map(snapshot => snapshot ? snapshot.getValue(key, defaultValue, user ?? this.defaultUser) : defaultValue as SettingTypeOf<T>),
      distinctUntilChanged()
    );
  }

  getAllValues(user?: User): Observable<Map<string, SettingValue>> {
    return this.snapshotSubject.pipe(
      map(snapshot => snapshot
        // Evaluate feature flags and build a key-value map.
        ? snapshot.getAllKeys()
          .reduce(
            (keyValues, key) => (keyValues.set(key, snapshot.getValue(key, void 0, user ?? this.defaultUser)), keyValues),
            new Map<string, SettingValue>()
          )
        : new Map<string, SettingValue>()
      ),
      distinctUntilChanged((prev, current) => {
        // Check if there are any changes compared to the previous key-value map.
        if (prev.size !== current.size) return false;
        for (const key of prev.keys()) {
          if (!current.has(key) || current.get(key) !== prev.get(key)) {
            return false;
          }
        }
        return true;
      })
    );
  }
}

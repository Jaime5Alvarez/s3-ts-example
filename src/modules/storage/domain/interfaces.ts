export interface IStorage {
	getItem(key: string): Promise<Blob>;
	setItem(key: string, value: Blob): Promise<void>;
	removeItem(key: string): Promise<void>;
	getTempUrl(key: string): Promise<string>;
}

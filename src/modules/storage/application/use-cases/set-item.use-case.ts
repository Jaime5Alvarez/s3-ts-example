import type { IStorage } from "@/modules/storage/domain/interfaces";

export class SetItemUseCase {
	constructor(private readonly storage: IStorage) {}

	async execute(key: string, value: Blob): Promise<void> {
		await this.storage.setItem(key, value);
	}
}

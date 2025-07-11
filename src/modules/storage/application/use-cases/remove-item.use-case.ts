import type { IStorage } from "@/modules/storage/domain/interfaces";

export class RemoveItemUseCase {
	constructor(private readonly storage: IStorage) {}

	async execute(key: string): Promise<void> {
		await this.storage.removeItem(key);
	}
}

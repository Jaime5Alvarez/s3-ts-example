import type { IStorage } from "@/modules/storage/domain/interfaces";

export class GetItemUseCase {
	constructor(private readonly storage: IStorage) {}

	async execute(key: string): Promise<Blob> {
		return await this.storage.getItem(key);
	}
}

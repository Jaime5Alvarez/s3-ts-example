import type { IStorage } from "@/modules/storage/domain/interfaces";

export class GetTempUrlUseCase {
	constructor(private readonly storage: IStorage) {}

	async execute(key: string): Promise<string> {
		return await this.storage.getTempUrl(key);
	}
}

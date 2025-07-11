import { S3StorageService } from "@/modules/storage/infraestructure/s3-storage-service";
import {
	GetItemUseCase,
	GetTempUrlUseCase,
	RemoveItemUseCase,
	SetItemUseCase,
} from "./use-cases";

// Example usage of all storage use cases
export class StorageExample {
	private readonly getItemUseCase: GetItemUseCase;
	private readonly setItemUseCase: SetItemUseCase;
	private readonly removeItemUseCase: RemoveItemUseCase;
	private readonly getTempUrlUseCase: GetTempUrlUseCase;

	constructor() {
		const storage = new S3StorageService("my-bucket");

		this.getItemUseCase = new GetItemUseCase(storage);
		this.setItemUseCase = new SetItemUseCase(storage);
		this.removeItemUseCase = new RemoveItemUseCase(storage);
		this.getTempUrlUseCase = new GetTempUrlUseCase(storage);
	}

	async uploadFile(fileName: string, fileContent: Blob): Promise<void> {
		try {
			await this.setItemUseCase.execute(fileName, fileContent);
			console.log(`File ${fileName} uploaded successfully`);
		} catch (error) {
			console.error(`Failed to upload ${fileName}:`, error);
			throw error;
		}
	}

	async downloadFile(fileName: string): Promise<Blob> {
		try {
			const fileContent = await this.getItemUseCase.execute(fileName);
			console.log(`File ${fileName} downloaded successfully`);
			return fileContent;
		} catch (error) {
			console.error(`Failed to download ${fileName}:`, error);
			throw error;
		}
	}

	async deleteFile(fileName: string): Promise<void> {
		try {
			await this.removeItemUseCase.execute(fileName);
			console.log(`File ${fileName} deleted successfully`);
		} catch (error) {
			console.error(`Failed to delete ${fileName}:`, error);
			throw error;
		}
	}

	async getFileDownloadUrl(fileName: string): Promise<string> {
		try {
			const url = await this.getTempUrlUseCase.execute(fileName);
			console.log(`Temporary URL generated for ${fileName}`);
			return url;
		} catch (error) {
			console.error(`Failed to generate URL for ${fileName}:`, error);
			throw error;
		}
	}

	// Example workflow: upload, get URL, download, delete
	async completeFileWorkflow(
		fileName: string,
		fileContent: Blob,
	): Promise<void> {
		try {
			// 1. Upload file
			await this.uploadFile(fileName, fileContent);

			// 2. Get temporary URL
			const downloadUrl = await this.getFileDownloadUrl(fileName);
			console.log(`Download URL: ${downloadUrl}`);

			// 3. Download file (optional - just to verify)
			const downloadedContent = await this.downloadFile(fileName);
			console.log(`Downloaded file size: ${downloadedContent.size} bytes`);

			// 4. Delete file
			await this.deleteFile(fileName);

			console.log("Complete workflow executed successfully");
		} catch (error) {
			console.error("Workflow failed:", error);
			throw error;
		}
	}
}

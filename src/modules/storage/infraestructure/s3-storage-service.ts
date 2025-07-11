import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { IStorage } from "@/modules/storage/domain/interfaces";

export class S3StorageService implements IStorage {
	private readonly s3: S3Client;
	private readonly bucketName: string;

	constructor(bucketName: string, s3Client?: S3Client) {
		this.bucketName = bucketName;
		this.s3 =
			s3Client ||
			new S3Client({
				endpoint: "http://localhost:4566",
				credentials: {
					accessKeyId: "test",
					secretAccessKey: "test",
				},
				region: "eu-south-2",
			});
	}

	async getItem(key: string): Promise<Blob> {
		try {
			const command = new GetObjectCommand({
				Bucket: this.bucketName,
				Key: key,
			});
			const item = await this.s3.send(command);

			if (!item.Body) {
				throw new Error(`Object ${key} not found or empty`);
			}

			const blob = new Blob([await item.Body.transformToByteArray()]);
			return blob;
		} catch (error) {
			throw new Error(
				`Failed to get item ${key}: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async setItem(key: string, value: Blob): Promise<void> {
		try {
			const arrayBuffer = await value.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const command = new PutObjectCommand({
				Bucket: this.bucketName,
				Key: key,
				Body: buffer,
			});
			await this.s3.send(command);
		} catch (error) {
			throw new Error(
				`Failed to set item ${key}: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async removeItem(key: string): Promise<void> {
		try {
			const command = new DeleteObjectCommand({
				Bucket: this.bucketName,
				Key: key,
			});
			await this.s3.send(command);
		} catch (error) {
			throw new Error(
				`Failed to remove item ${key}: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async getTempUrl(key: string): Promise<string> {
		try {
			const command = new GetObjectCommand({
				Bucket: this.bucketName,
				Key: key,
			});
			const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
			return url;
		} catch (error) {
			throw new Error(
				`Failed to get temp URL for ${key}: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}
}
